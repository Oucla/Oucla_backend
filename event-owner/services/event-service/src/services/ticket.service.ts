import { PrismaClient, Ticket, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class CreateTicketService {
  public async createTicket(data: Prisma.TicketUncheckedCreateInput): Promise<Ticket> {
    return prisma.ticket.create({
      data: {
        ...data,
        // Ensure nullable columns receive null instead of undefined
        description: data.description ?? null,
      },
    });
  }

  public async getAllTickets(): Promise<Ticket[]> {
    return prisma.ticket.findMany();
  }

  public async getTicketById(id: string): Promise<Ticket | null> {
    return prisma.ticket.findUnique({ where: { id } });
  }

  public async updateTicket(id: string, data: Partial<Ticket>): Promise<Ticket> {
    return prisma.ticket.update({ where: { id }, data });
  }

  public async deleteTicket(id: string): Promise<Ticket> {
    return prisma.ticket.delete({ where: { id } });
  }
}
