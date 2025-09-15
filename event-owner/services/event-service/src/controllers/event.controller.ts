import { Request, Response } from "express";
import { CreateEventService } from "../services/event.service";

export class CreateEventController {
  private eventService = new CreateEventService();

  public createEvent = async (req: Request, res: Response) => {
    try {
      const eventData = req.body;
      const event = await this.eventService.createEvent(eventData);
      res.status(201).json(event);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  public updateEvent = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Event ID is required" });
      }
      const event = await this.eventService.updateEvent(id, req.body);
      res.json(event);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  public deleteEvent = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Event ID is required" });
      }
      const event = await this.eventService.deleteEvent(id);
      res.json(event);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };
}
