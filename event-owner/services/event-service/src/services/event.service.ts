import { PrismaClient, Event, VirtualType } from "@prisma/client";

const prisma = new PrismaClient();

type EventInput = Omit<Event, "id" | "createdAt" | "updatedAt"> & {
  virtualUrl?: string | null;
  virtualType?: VirtualType | null;
};

export class CreateEventService {
  public async createEvent(data: EventInput): Promise<Event> {
    // Virtual validation
    if (data.isVirtual) {
      if (!data.virtualUrl) {
        throw new Error("Virtual events must include a virtualUrl");
      }
      if (!data.virtualType) {
        throw new Error("Virtual events must include a virtualType");
      }
      data.location = data.location ?? null;
    } else {
      // Physical-only events must have location
      if (!data.location) {
        throw new Error("Physical events must include a location");
      }
      data.virtualUrl = null;
      data.virtualType = null;
    }

    return prisma.event.create({ data });
  }

  public async updateEvent(id: string, data: Partial<EventInput>): Promise<Event> {
    if (data.isVirtual) {
      if (!data.virtualUrl) {
        throw new Error("Virtual events must include a virtualUrl");
      }
      if (!data.virtualType) {
        throw new Error("Virtual events must include a virtualType");
      }
      if (!("location" in data)) {
        data.location = null;
      }
    } else if (data.isVirtual === false) {
      if (!data.location) {
        throw new Error("Physical events must include a location");
      }
      data.virtualUrl = null;
      data.virtualType = null;
    }

    return prisma.event.update({ where: { id }, data });
  }

  public async deleteEvent(id: string): Promise<Event> {
    return prisma.event.delete({ where: { id } });
  }
}
