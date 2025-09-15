import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { CreateEventRoutes } from "../routes/event.routes";
import { CreateTicketRoutes } from "../routes/ticket.routes";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeHealthCheck();
  }

  private initializeMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private initializeRoutes(): void {
    this.app.get("/", (_req: Request, res: Response) => {
      res.json({ message: "Event Service API" });
    });

    this.app.use("/api/events", new CreateEventRoutes().router);
    this.app.use("/api/tickets", new CreateTicketRoutes().router);
  }

  private initializeHealthCheck(): void {
    this.app.get("/health", async (_req: Request, res: Response, _next: NextFunction) => {
      try {
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({ status: "ok", db: "connected" });
      } catch (err) {
        console.error("Health check failed:", err instanceof Error ? err.message : err);
        res.status(500).json({ status: "error", db: "not connected" });
      }
    });
  }

  public async start(): Promise<void> {
    const PORT = process.env.PORT || 7000; // 👈 use a different port from dashboard-service
    try {
      await prisma.$connect();
      console.log("Event Service database connected successfully");
    } catch (err) {
      console.error("Database connection failed:", err);
      process.exit(1);
    }

    this.app.listen(PORT, () => {
      console.log(`🎉 Event Service running on http://localhost:${PORT}`);
    });
  }
}
