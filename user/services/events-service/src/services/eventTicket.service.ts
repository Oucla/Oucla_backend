import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class EventTicketService {


  // Get all events
  public async getAllEvents() {
    return await prisma.event.findMany({
      include: this.eventInclude(),
    });
  }

  // Get events filtered by category
  public async getEventsByCategory(category: string) {
    return await prisma.event.findMany({
      where: { category },
      include: this.eventInclude(),
    });
  }

  // Get details of a single event including venues, sections, seats, tickets, and categories
  public async getEventById(eventId: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: this.eventInclude(),
    });

    if (!event) throw new Error("Event not found");
    return event;
  }

  // Optional: Get all events for a specific owner
  public async getAllEventsByOwner(ownerId: string) {
    return await prisma.event.findMany({
      where: { ownerId },
      include: this.eventInclude(),
    });
  }



  // Get all tickets for an event, including ticket instances and seats
  public async getTicketsByEvent(eventId: string) {
    return await prisma.ticket.findMany({
      where: { eventId },
      include: {
        ticketInstances: {
          include: {
            seat: {
              include: { section: true },
            },
          },
        },
      },
    });
  }

  // Get a single ticket with its instances and seat assignments
  public async getTicketById(ticketId: string) {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        ticketInstances: {
          include: {
            seat: {
              include: { section: true },
            },
          },
        },
      },
    });

    if (!ticket) throw new Error("Ticket not found");
    return ticket;
  }



  // Include relations for events (venues, sections, seats, tickets)
  private eventInclude() {
    return {
      venues: {
        include: {
          sections: {
            include: {
              seats: {
                include: {
                  ticketInstance: {
                    include: { ticket: true },
                  },
                },
              },
            },
          },
        },
      },
      tickets: {
        include: {
          categories: { include: { ticketInstances: { include: { seat: true } } } },
          ticketInstances: { include: { seat: true } },
        },
      },
    };
  }
}
