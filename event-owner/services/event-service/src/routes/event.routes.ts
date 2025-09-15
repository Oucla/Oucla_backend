import { Router } from "express";
import { CreateEventController } from "../controllers/event.controller";

export class CreateEventRoutes {
  public router = Router();
  private controller = new CreateEventController();

  constructor() {
    this.router.post("/", this.controller.createEvent);
    this.router.put("/:id", this.controller.updateEvent);
    this.router.delete("/:id", this.controller.deleteEvent);
  }
}
