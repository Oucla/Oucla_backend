import { Router } from "express";
import { EmailController } from "../controllers/email.controller";

const router = Router();
const controller = new EmailController();

router.post("/send", controller.send);

export default router;
