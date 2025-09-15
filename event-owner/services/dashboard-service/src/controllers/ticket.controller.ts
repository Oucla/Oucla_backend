import type { Request, Response } from "express";
import { TicketService } from "../services/ticket.service";
import type { Ticket } from "@prisma/client";

export class TicketController {
  private ticketService = new TicketService();

  // Get all tickets for a specific event
  public getTicketsByEvent = async (req: Request, res: Response) => {
    try {
      const eventId = req.params.eventId;

      if (!eventId) {
        return res.status(400).json({ error: "Event ID is required" });
      }

      const tickets: Ticket[] = await this.ticketService.getTicketsByEvent(eventId);

      return res.status(200).json(tickets);
    } catch (err: any) {
      console.error("Error in getTicketsByEvent:", err);
      return res.status(500).json({ error: err.message || "Internal server error" });
    }
  };

  // Get details of a single ticket including seat assignments
  public getTicketById = async (req: Request, res: Response) => {
    try {
      const ticketId = req.params.ticketId;

      if (!ticketId) {
        return res.status(400).json({ error: "Ticket ID is required" });
      }

      const ticket = await this.ticketService.getTicketById(ticketId);

      if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
      }

      return res.status(200).json(ticket);
    } catch (err: any) {
      console.error("Error in getTicketById:", err);
      return res.status(500).json({ error: err.message || "Internal server error" });
    }
  };
}
