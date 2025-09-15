import { Request, Response } from "express";
import { CreateTicketService } from "../services/ticket.service";

export class CreateTicketController {
  private ticketService = new CreateTicketService();

  // Create ticket
  createTicket = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      if (!data.eventId || !data.type || !data.saleStart || !data.saleEnd) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const ticket = await this.ticketService.createTicket(data);
      return res.status(201).json(ticket);
    } catch (err: any) {
      console.error("Error in createTicket:", err);
      return res.status(500).json({ error: err.message });
    }
  };

  // Get all tickets
  getAllTickets = async (_req: Request, res: Response) => {
    try {
      const tickets = await this.ticketService.getAllTickets();
      return res.status(200).json(tickets);
    } catch (err: any) {
      console.error("Error in getAllTickets:", err);
      return res.status(500).json({ error: err.message });
    }
  };

  // Get ticket by ID
  getTicketById = async (req: Request, res: Response) => {
    try {
      const { ticketId } = req.params;
      if (!ticketId) return res.status(400).json({ error: "Missing ticketId" });

      const ticket = await this.ticketService.getTicketById(ticketId);
      if (!ticket) return res.status(404).json({ error: "Ticket not found" });

      return res.status(200).json(ticket);
    } catch (err: any) {
      console.error("Error in getTicketById:", err);
      return res.status(500).json({ error: err.message });
    }
  };

  // Update ticket
  updateTicket = async (req: Request, res: Response) => {
    try {
      const { ticketId } = req.params;
      if (!ticketId) return res.status(400).json({ error: "Missing ticketId" });
      const data = req.body;

      const updatedTicket = await this.ticketService.updateTicket(ticketId, data);
      return res.status(200).json(updatedTicket);
    } catch (err: any) {
      console.error("Error in updateTicket:", err);
      return res.status(500).json({ error: err.message });
    }
  };

  // Delete ticket
  deleteTicket = async (req: Request, res: Response) => {
    try {
      const { ticketId } = req.params;
      if (!ticketId) return res.status(400).json({ error: "Missing ticketId" });

      await this.ticketService.deleteTicket(ticketId);
      return res.status(200).json({ message: "Ticket deleted successfully" });
    } catch (err: any) {
      console.error("Error in deleteTicket:", err);
      return res.status(500).json({ error: err.message });
    }
  };
}
