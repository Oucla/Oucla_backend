import type { Request, Response } from "express";
import { EventTicketService } from "../services/eventTicket.service";

export class EventTicketController {
  private service = new EventTicketService();

  /*** EVENTS ***/

  // Get all events 
  public getAllEvents = async (req: Request, res: Response) => {
    try {
      const events = await this.service.getAllEvents();
      return res.status(200).json(events);
    } catch (err: any) {
      console.error("Error in getAllEvents:", err);
      return res.status(500).json({ error: err.message || "Internal server error" });
    }
  };

  // Get events filtered by category
  public getEventsByCategory = async (req: Request, res: Response) => {
    try {
      const category = req.params.category;
      if (!category) return res.status(400).json({ error: "Category is required" });

      const events = await this.service.getEventsByCategory(category);
      return res.status(200).json(events);
    } catch (err: any) {
      console.error("Error in getEventsByCategory:", err);
      return res.status(500).json({ error: err.message || "Internal server error" });
    }
  };

  // Get event details by ID including venues, sections, seats, tickets
  public getEventById = async (req: Request, res: Response) => {
    try {
      const eventId = req.params.eventId;
      if (!eventId) return res.status(400).json({ error: "Event ID is required" });

      const event = await this.service.getEventById(eventId);
      return res.status(200).json(event);
    } catch (err: any) {
      console.error("Error in getEventById:", err);
      return res.status(500).json({ error: err.message || "Internal server error" });
    }
  };

  // Optional: Get all events by owner
  public getAllEventsByOwner = async (req: Request, res: Response) => {
    try {
      const ownerId = req.params.ownerId;
      if (!ownerId) return res.status(400).json({ error: "Owner ID is required" });

      const events = await this.service.getAllEventsByOwner(ownerId);
      return res.status(200).json(events);
    } catch (err: any) {
      console.error("Error in getAllEventsByOwner:", err);
      return res.status(500).json({ error: err.message || "Internal server error" });
    }
  };

  /*** TICKETS ***/

  // Get all tickets for a specific event
  public getTicketsByEvent = async (req: Request, res: Response) => {
    try {
      const eventId = req.params.eventId;
      if (!eventId) return res.status(400).json({ error: "Event ID is required" });

      const tickets = await this.service.getTicketsByEvent(eventId);
      return res.status(200).json(tickets);
    } catch (err: any) {
      console.error("Error in getTicketsByEvent:", err);
      return res.status(500).json({ error: err.message || "Internal server error" });
    }
  };

  // Get ticket details by ID
  public getTicketById = async (req: Request, res: Response) => {
    try {
      const ticketId = req.params.ticketId;
      if (!ticketId) return res.status(400).json({ error: "Ticket ID is required" });

      const ticket = await this.service.getTicketById(ticketId);
      return res.status(200).json(ticket);
    } catch (err: any) {
      console.error("Error in getTicketById:", err);
      return res.status(500).json({ error: err.message || "Internal server error" });
    }
  };
}
