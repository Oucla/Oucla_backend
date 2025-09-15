import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateBody } from "../middlewares/validate.middleware";
import { registerSchema } from "../schemas/auth.schema";
import { loginRateLimiter } from "../middlewares/rate-limiter.middleware";

const router = Router();
const authController = new AuthController();

router.post("/register", validateBody(registerSchema), authController.register);
router.post("/verify-email", authController.verifyEmail);
router.post("/verify-phone", authController.verifyPhone);
router.post("/login", loginRateLimiter, authController.login);
router.post("/resend-verification-email", authController.resendVerificationEmail);

export default router;
