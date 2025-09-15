import { Router } from "express";
import { CreateTicketController } from "../controllers/ticket.controller";

export class CreateTicketRoutes {
  public router: Router;
  private controller: CreateTicketController;

  constructor() {
    this.router = Router();
    this.controller = new CreateTicketController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", this.controller.createTicket);
    this.router.get("/", this.controller.getAllTickets);
    this.router.get("/:ticketId", this.controller.getTicketById);
    this.router.put("/:ticketId", this.controller.updateTicket);
    this.router.delete("/:ticketId", this.controller.deleteTicket);
  }
}
