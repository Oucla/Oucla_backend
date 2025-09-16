import { Router } from "express";
import { EventTicketController } from "../controllers/eventTicket.controller";

export class EventTicketRoutes {
  public router = Router();
  private controller = new EventTicketController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Events
    this.router.get("/", this.controller.getAllEvents);                           // GET /events
    this.router.get("/category/:category", this.controller.getEventsByCategory);  // GET /events/category/:category
    this.router.get("/owner/:ownerId", this.controller.getAllEventsByOwner);      // GET /events/owner/:ownerId
    this.router.get("/:eventId", this.controller.getEventById);                   // GET /events/:eventId
 
    // Tickets
    this.router.get("/:eventId/tickets", this.controller.getTicketsByEvent);      // GET /events/:eventId/tickets
    this.router.get("/tickets/:ticketId", this.controller.getTicketById);         // GET /events/tickets/:ticketId
  }
}
