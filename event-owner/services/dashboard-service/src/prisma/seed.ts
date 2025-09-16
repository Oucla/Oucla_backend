import { PrismaClient, TicketType, SeatType, VirtualType, LayoutType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const ownerId = "ec9b2554-86f5-4bca-9e8b-fa6a81e868e5";

  console.log("Seeding EventOwner...");
  await prisma.eventOwner.upsert({
    where: { id: ownerId },
    update: {},
    create: {
      id: ownerId,
      ownerType: "INDIVIDUAL",
      email: "owner@example.com",
      password: "hashedpassword",
      firstName: "John",
      lastName: "Doe",
      role: "INDIVIDUAL",
      emailVerified: true,
      phoneVerified: true,
    },
  });

  console.log("Seeding Events...");
  const eventData = [
    { title: "Football Championship Final", category: "Sports", location: "National Stadium", isVirtual: true, virtualType: VirtualType.BOTH },
    { title: "Rock Concert Live", category: "Music", location: "Arena Hall", isVirtual: true, virtualType: VirtualType.VR },
    { title: "Business Conference 2025", category: "Conference", location: "Conference Center", isVirtual: false, virtualType: null },
    { title: "Art Exhibition Opening", category: "Arts", location: "City Art Gallery", isVirtual: true, virtualType: VirtualType.LIVE },
    { title: "Comedy Show Night", category: "Comedy", location: "Downtown Theater", isVirtual: true, virtualType: VirtualType.BOTH },
    { title: "Virtual Reality Gaming Meetup", category: "Gaming", location: null, isVirtual: true, virtualType: VirtualType.VR },
    { title: "Charity Gala Dinner", category: "Fundraising", location: "Grand Hotel Ballroom", isVirtual: false, virtualType: null },
    { title: "Tech Startup Pitch Day", category: "Tech", location: "Innovation Hub", isVirtual: true, virtualType: VirtualType.LIVE },
    { title: "Indie Music Festival", category: "Music", location: "Open Air Park", isVirtual: true, virtualType: VirtualType.BOTH },
    { title: "Football Club Friendly Match", category: "Sports", location: "Local Stadium", isVirtual: false, virtualType: null },
  ];

  for (const eventInfo of eventData) {
    // Create Event
    const event = await prisma.event.create({
      data: {
        ownerId,
        title: eventInfo.title,
        description: `Description for ${eventInfo.title}`,
        category: eventInfo.category,
        location: eventInfo.location,
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        isVirtual: eventInfo.isVirtual,
        virtualType: eventInfo.virtualType,
        maxAttendees: 500,
      },
    });

    // Create Venues
    const venues = [
      await prisma.venue.create({ data: { eventId: event.id, name: `${eventInfo.title} - Main Venue`, description: "Main venue description", layoutType: LayoutType.CONFERENCE } }),
      await prisma.venue.create({ data: { eventId: event.id, name: `${eventInfo.title} - Secondary Venue`, description: "Secondary venue description", layoutType: LayoutType.SHOW } }),
    ];

    // Create Sections and Seats
    for (const venue of venues) {
      const sectionNames = venue.name.includes("Main") ? ["VIP Section", "General Section", "Balcony"] : ["Floor", "Gallery"];
      const sections = await Promise.all(sectionNames.map((name) => prisma.section.create({ data: { venueId: venue.id, name } })));

      for (const section of sections) {
        const seats = Array.from({ length: 5 }).map((_, i) => ({ sectionId: section.id, label: `${section.name}-${i + 1}`, type: SeatType.NORMAL }));
        await prisma.seat.createMany({ data: seats });
      }
    }

    // --- Create NORMAL Ticket + Categories ---
    const normalTicket = await prisma.ticket.create({
      data: {
        eventId: event.id,
        type: TicketType.NORMAL,
        description: "Normal tickets for event",
        saleStart: new Date(),
        saleEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const normalCategories = [
      { name: "Regular", price: 50, quantity: 100 },
      { name: "Executive", price: 80, quantity: 50 },
      { name: "Table for 10", price: 400, quantity: 10 },
    ];

    const createdCategories = await Promise.all(
      normalCategories.map((cat) =>
        prisma.ticketCategory.create({
          data: {
            ticketId: normalTicket.id,
            name: cat.name,
            price: cat.price,
            quantity: cat.quantity,
          },
        })
      )
    );

    // --- Create VR Ticket if applicable ---
    if (eventInfo.isVirtual && (eventInfo.virtualType === VirtualType.VR || eventInfo.virtualType === VirtualType.BOTH)) {
      await prisma.ticket.create({
        data: {
          eventId: event.id,
          type: TicketType.VR,
          description: "Virtual Reality streaming ticket",
          saleStart: new Date(),
          saleEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
    }

    // --- Create VIP Ticket if venue has VIP sections ---
    if (!venues[0]) {
      throw new Error("No venue found for VIP ticket creation.");
    }
    const vipSection = await prisma.section.findFirst({ where: { venueId: venues[0].id, name: { contains: "VIP" } } });
    if (vipSection) {
      const vipTicket = await prisma.ticket.create({
        data: {
          eventId: event.id,
          type: TicketType.VIP,
          description: "VIP seating ticket",
          saleStart: new Date(),
          saleEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      const vipSeats = await prisma.seat.findMany({ where: { sectionId: vipSection.id } });
      for (const seat of vipSeats) {
        await prisma.ticketInstance.create({
          data: {
            ticketId: vipTicket.id,
            seatId: seat.id,
            buyerId: null,
          },
        });
      }
    }

    // --- Assign NORMAL ticket instances to seats (General / Balcony sections) ---
    if (!venues[0]) {
      throw new Error("No venue found for assigning normal ticket instances to seats.");
    }
    const normalSections = await prisma.section.findMany({ where: { venueId: venues[0].id, name: { not: { contains: "VIP" } } } });
    for (const section of normalSections) {
      const seats = await prisma.seat.findMany({ where: { sectionId: section.id } });
      for (const seat of seats) {
        if (!createdCategories || createdCategories.length === 0) {
          throw new Error("No ticket categories found for normal ticket assignment.");
        }
        const randomCategory = createdCategories[Math.floor(Math.random() * createdCategories.length)];
        await prisma.ticketInstance.create({
          data: {
            ticketId: normalTicket.id,
            categoryId: randomCategory?.id ?? null,
            seatId: seat.id,
            buyerId: null,
          },
        });
      }
    }
  }

  console.log("Seeding complete with ticket categories, VIP tickets, and seat assignments!");
}

main()
  .catch((e) => {
    console.error(e);
    // Use globalThis.process to avoid issues if process is not defined in some environments
    if (typeof globalThis.process !== "undefined") {
      globalThis.process.exit(1);
    }
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
