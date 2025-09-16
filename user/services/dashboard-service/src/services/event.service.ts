import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class EventService {
  // Get all events for a specific owner
  public async getAllEventsByOwner(ownerId: string) {
    return await prisma.event.findMany({
      where: { ownerId },
      include: {
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
            categories: { // include categories for NORMAL tickets
              include: {
                ticketInstances: { // ticketInstances linked to each category
                  include: { seat: true },
                },
              },
            },
            ticketInstances: { // ticketInstances for VR or VIP tickets
              include: { seat: true },
            },
          },
        },
      },
    });
  }

  // Get details of a single event including venues, sections, seats, tickets, and categories
  public async getEventById(eventId: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
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
            categories: {
              include: {
                ticketInstances: {
                  include: { seat: true },
                },
              },
            },
            ticketInstances: {
              include: { seat: true },
            },
          },
        },
      },
    });

    if (!event) throw new Error("Event not found");
    return event;
  }
}
