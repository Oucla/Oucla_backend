import type { Request, Response } from "express";
import { EventService } from "../services/event.service";
import type { Event } from "@prisma/client";

export class EventController {
  private eventService = new EventService();

  // Get all events for a specific owner
  public getAllEventsByOwner = async (req: Request, res: Response) => {
    try {
      const ownerId = req.params.ownerId;

      if (!ownerId) {
        return res.status(400).json({ error: "Owner ID is required" });
      }

      const events: Event[] = await this.eventService.getAllEventsByOwner(ownerId);

      return res.status(200).json(events);
    } catch (err: any) {
      console.error("Error in getAllEventsByOwner:", err);
      return res.status(500).json({ error: err.message || "Internal server error" });
    }
  };

  // Get event details including venues, sections, seats, and tickets
  public getEventById = async (req: Request, res: Response) => {
    try {
      const eventId = req.params.eventId;

      if (!eventId) {
        return res.status(400).json({ error: "Event ID is required" });
      }

      const event = await this.eventService.getEventById(eventId);

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      return res.status(200).json(event);
    } catch (err: any) {
      console.error("Error in getEventById:", err);
      return res.status(500).json({ error: err.message || "Internal server error" });
    }
  };
}
