import { PrismaClient, Prisma } from "@prisma/client";
import { HashUtil } from "../utils/hash.util";
import { JwtUtil } from "../utils/jwt.util";
import { VerificationUtil } from "../utils/VerificationUtil";
import { EmailClient } from "../utils/EmailClient";

const prisma = new PrismaClient();
const emailClient = new EmailClient();

export class AuthService {

  /*** Register a new User */
  async register(data: {
    email: string;
    password: string;
    fullName?: string;
  
  }) {
    const { email, password, fullName} = data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error("User already exists");

    // Hash password & generate email token
    const hashedPassword = await HashUtil.hashPassword(password);
    const emailToken = VerificationUtil.generateEmailToken();
    const emailExpiry = VerificationUtil.getExpiry(15); // 15 minutes

    let otpCode: string | null = null;
    let otpExpiry: Date | null = null;

   
      otpCode = VerificationUtil.generatePhoneOTP();
      otpExpiry = VerificationUtil.getExpiry(15); // 15 minutes


    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName: fullName ?? null,
        emailVerifyToken: emailToken,
        emailTokenExpiry: emailExpiry,
        otpVerifyCode: otpCode,
        otpCodeExpiry: otpExpiry,
      },
    });

    // Send verification email
    try {
      const baseUrl = process.env.APP_BASE_URL;
      if (!baseUrl) throw new Error("APP_BASE_URL not defined");
      const verifyLink = `${baseUrl}/verify-email?token=${emailToken}`;
      const otp = otpCode;

      await emailClient.sendTemplateEmail(
        email,
        "Verify Your Account",
        "userRegistration",
        {
          name: fullName || "Oucler",
          verifyLink,
          otp,
          year: new Date().getFullYear().toString(),
        }
      );
    } catch (emailError: any) {
      console.error(`Failed to send email to ${email}:`, emailError.message);
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      emailToken,  // for testing, remove in prod
      otpCode,     // for testing, remove in prod
    };
  }

  /*** Verify email */
  async verifyEmail(token: string) {
    const user = await prisma.user.findFirst({
      where: { emailVerifyToken: token, emailTokenExpiry: { gt: new Date() } },
    });
    if (!user) throw new Error("Invalid or expired email token");

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifyToken: null,
        emailTokenExpiry: null,
      },
    });

    return { message: "Email verified successfully" };
  }

  /*** Verify OTP */
  async verifyOtp(userId: string, code: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.otpVerifyCode !== code || (user.otpCodeExpiry && user.otpCodeExpiry < new Date())) {
      throw new Error("Invalid or expired OTP");
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        otpVerified: true,
        otpVerifyCode: null,
        otpCodeExpiry: null,
      },
    });

    return { message: "OTP verified successfully" };
  }

  /*** Resend verification email */
  async resendVerificationEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");
    if (user.emailVerified) return { message: "Email already verified" };

    const emailToken = VerificationUtil.generateEmailToken();
    const emailExpiry = VerificationUtil.getExpiry(15);

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerifyToken: emailToken, emailTokenExpiry: emailExpiry },
    });

    const baseUrl = process.env.APP_BASE_URL;
    if (!baseUrl) throw new Error("APP_BASE_URL not defined");
    const verifyLink = `${baseUrl}/verify-email?token=${emailToken}`;

    await emailClient.sendTemplateEmail(
      email,
      "Verify Your Account",
      "userRegistration",
      {
        name: user.fullName || "User",
        verifyLink,
        year: new Date().getFullYear().toString(),
      }
    );

    return { message: "Verification email resent successfully", emailToken };
  }

  /*** Login User */
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid email or password");
    if (!user.emailVerified) throw new Error("Email not verified");

    const isPasswordValid = await HashUtil.comparePassword(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid email or password");

    const token = JwtUtil.generateToken({ id: user.id, email: user.email });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }
}
