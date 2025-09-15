import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { EventRoutes } from "../routes/event.routes";
import { TicketRoutes } from "../routes/ticket.routes";
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
      res.json({ message: "Dashboard Service API" });
    });

    this.app.use("/api/events", new EventRoutes().router);
    this.app.use("/api/tickets", new TicketRoutes().router);
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
    const PORT = process.env.PORT || 6000;
    try {
      await prisma.$connect();
      console.log("Database connected successfully");
    } catch (err) {
      console.error("Database connection failed:", err);
      process.exit(1);
    }

    this.app.listen(PORT, () => {
      console.log(`Dashboard Service running on http://localhost:${PORT}`);
    });
  }
}
