import express, { Application } from "express";
import cors from "cors";
import emailRoutes from "../routes/email.route.js";

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use("/api/user-email", emailRoutes);
  }

  public start(PORT: number) {
    this.app.listen(PORT, () => {
      console.log(`Email Service running on http://localhost:${PORT}`);
    });
  }
}
