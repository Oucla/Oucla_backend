import { PrismaClient, Ticket } from "@prisma/client";

const prisma = new PrismaClient();

export class CreateTicketService {
  public async createTicket(data: {
    eventId: string;
    type: "NORMAL" | "VR" | "VIP";
    description?: string;
    saleStart: Date | string;
    saleEnd: Date | string;
    categories?: {
      name: string;
      price: number;
      quantity: number;
    }[];
  }): Promise<Ticket> {
    // Build ticket data object dynamically
    const ticketData: any = {
      eventId: data.eventId,
      type: data.type,
      description: data.description ?? null,
      saleStart: new Date(data.saleStart),
      saleEnd: new Date(data.saleEnd),
    };

    // Only include categories if provided
    if (data.categories && data.categories.length > 0) {
      ticketData.categories = {
        create: data.categories.map((cat) => ({
          name: cat.name,
          price: cat.price,
          quantity: cat.quantity,
        })),
      };
    }

    return prisma.ticket.create({
      data: ticketData,
      include: { categories: true },
    });
  }

  public async getAllTickets(): Promise<Ticket[]> {
    return prisma.ticket.findMany({
      include: { categories: true },
    });
  }

  public async getTicketById(id: string): Promise<Ticket | null> {
    return prisma.ticket.findUnique({
      where: { id },
      include: { categories: true },
    });
  }

  public async updateTicket(
    id: string,
    data: Partial<Ticket> & {
      categories?: { name: string; price: number; quantity: number }[];
    }
  ): Promise<Ticket> {
    const ticketData: any = {
      ...data,
      saleStart: data.saleStart ? new Date(data.saleStart) : undefined,
      saleEnd: data.saleEnd ? new Date(data.saleEnd) : undefined,
    };

    return prisma.ticket.update({
      where: { id },
      data: ticketData,
      include: { categories: true },
    });
  }

  public async deleteTicket(id: string): Promise<Ticket> {
    return prisma.ticket.delete({ where: { id } });
  }
}
