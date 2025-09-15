import express from "express";
import type { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import authRoutes from "../routes/auth.routes";
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
    // Root route
    this.app.get("/", (_req: Request, res: Response) => {
      res.json({ message: "Auth Service API" });
    });

    // API routes
    this.app.use("/api/auth", authRoutes);
  }

  private initializeHealthCheck(): void {
    this.app.get(
      "/health",
      async (_req: Request, res: Response, _next: NextFunction) => {
        try {
          // Try a lightweight DB query
          await prisma.$queryRaw`SELECT 1`;

          res.status(200).json({
            status: "ok",
            db: "connected",
          });
        } catch (err) {
          console.error(
            "Health check failed:",
            err instanceof Error ? err.message : err
          );
          res.status(500).json({
            status: "error",
            db: "not connected",
          });
        }
      }
    );
  }

  public async start(): Promise<void> {
    if (!process.env.PORT) {
      throw new Error("PORT is not defined in .env");
    }

    // Ensure DB connection before starting
    try {
      await prisma.$connect();
      console.log("connection established to database");
    } catch (err) {
      console.error("Database connection failed:", err);
      process.exit(1);
    }

    const PORT = process.env.PORT;
    this.app.listen(PORT, () => {
      console.log(` Auth Service running on http://localhost:${PORT}`);
    });
  }
}
