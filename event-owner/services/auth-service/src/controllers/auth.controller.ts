import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";

export class AuthController {
  private authService = new AuthService();

  register = async (req: Request, res: Response) => {
    try {
      const result = await this.authService.register(req.body);
      res.status(201).json({ message: "Registered. Verify email/phone.", ...result });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  verifyEmail = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const result = await this.authService.verifyEmail(token);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  verifyPhone = async (req: Request, res: Response) => {
    try {
      const { ownerId, code } = req.body;
      const result = await this.authService.verifyPhone(ownerId, code);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.status(200).json({ message: "Login successful", ...result });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  resendVerificationEmail = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const result = await this.authService.resendVerificationEmail(email);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };
}
