import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class TicketService {
  // Get all tickets for an event, including ticket instances and seats
  public async getTicketsByEvent(eventId: string) {
    return await prisma.ticket.findMany({
      where: { eventId },
      include: {
        ticketInstances: {
          include: {
            seat: {
              include: {
                section: true,
              },
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
              include: {
                section: true,
                // You could also include the venue if needed
              },
            },
          },
        },
      },
    });

    if (!ticket) throw new Error("Ticket not found");
    return ticket;
  }
}
