import { Router } from "express";
import { TicketController } from "../controllers/ticket.controller";

export class TicketRoutes {
  public router = Router();
  private controller = new TicketController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Get all tickets for a specific event
    this.router.get("/event/:eventId", this.controller.getTicketsByEvent);

    // Get a single ticket details including seats
    this.router.get("/:ticketId", this.controller.getTicketById);
  }
}
