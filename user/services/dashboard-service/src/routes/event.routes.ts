import { Router } from "express";
import { EventController } from "../controllers/event.controller";

export class EventRoutes {
  public router = Router();
  private controller = new EventController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/owner/:ownerId", this.controller.getAllEventsByOwner);
    this.router.get("/:eventId", this.controller.getEventById);
  }
}
