import type { Request, Response } from "express";
import { EmailService } from "../services/email.service";

export class EmailController {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  send = async (req: Request, res: Response) => {
    try {
      const { to, subject, templateName, templateVars, text } = req.body;
      await this.emailService.sendEmail({ to, subject, templateName, templateVars, text });
      res.status(200).json({ message: "Email sent successfully" });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
}
