import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateBody } from "../middlewares/validate.middleware";
import { registerSchema } from "../schemas/auth.schema";
import { loginRateLimiter } from "../middlewares/rate-limiter.middleware";

const router = Router();
const authController = new AuthController();

router.post("/user/register", validateBody(registerSchema), authController.register);
router.post("/user/verify-email", authController.verifyEmail);
router.post("/user/verify-phone", authController.verifyPhone);
router.post("/user/login", loginRateLimiter, authController.login);
router.post("/user/resend-verification-email", authController.resendVerificationEmail);

export default router;
