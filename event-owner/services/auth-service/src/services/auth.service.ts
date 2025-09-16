import { PrismaClient, Prisma } from "@prisma/client";
import { HashUtil } from "../utils/hash.util";
import { JwtUtil } from "../utils/jwt.util";
import { VerificationUtil } from "../utils/VerificationUtil";
import { EmailClient } from "../utils/EmailClient";

const prisma = new PrismaClient();
const emailClient = new EmailClient();

export class AuthService {
  /*** Register a new EventOwner with email & optional phone verification */
  async register(data: {
    ownerType: "INDIVIDUAL" | "COMPANY";
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    contactPerson?: string;
    phoneNumber?: string;
  }) {
    const {
      ownerType,
      email,
      password,
      firstName,
      lastName,
      companyName,
      contactPerson,
      phoneNumber,
    } = data;

    if (ownerType === "COMPANY" && !companyName)
      throw new Error("Company name is required for COMPANY owners");
    if (ownerType === "INDIVIDUAL" && (!firstName || !lastName))
      throw new Error(
        "First name and Last name are required for INDIVIDUAL owners"
      );

    // Generate tokens and hash password before DB transaction
    const hashedPassword = await HashUtil.hashPassword(password);
    const emailToken = VerificationUtil.generateEmailToken();
    const emailExpiry = VerificationUtil.getExpiry(15); // 15 minutes
    let phoneOTP: string | null = null;
    let phoneExpiry: Date | null = null;

    if (phoneNumber) {
      phoneOTP = VerificationUtil.generatePhoneOTP();
      phoneExpiry = VerificationUtil.getExpiry(5); // 5 minutes
    }

    // Create EventOwner inside the transaction (only DB operations)
    const eventOwner = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Check if email already exists
      const existingOwner = await tx.eventOwner.findUnique({ where: { email } });
      if (existingOwner) throw new Error("Event owner already exists");
      const role: "INDIVIDUAL" | "COMPANY" = ownerType === "COMPANY" ? "COMPANY" : "INDIVIDUAL";



      return await tx.eventOwner.create({
        data: {
          ownerType,
          email,
          password: hashedPassword,
          firstName: firstName ?? null,
          lastName: lastName ?? null,
          companyName: companyName ?? null,
          contactPerson: contactPerson ?? null,
          phoneNumber: phoneNumber ?? null,
          role,
          emailVerifyToken: emailToken,
          emailTokenExpiry: emailExpiry,
          phoneVerifyCode: phoneOTP,
          phoneCodeExpiry: phoneExpiry,
        },
      });
    });

    // Send verification email 
    try {
      const baseUrl = process.env.APP_BASE_URL;
      if (!baseUrl) throw new Error("APP_BASE_URL is not defined in environment variables");

      const verifyLink = `${baseUrl}/verify-email?token=${emailToken}`;
      const otpCode  = phoneOTP ?? "";

      await emailClient.sendTemplateEmail(
        email,
        "Verify Your Event Owner Account",
        "eventOwnerRegistration", // template file in email-service
        {
          name: (firstName ?? companyName ?? "Oucler") as string,
          verifyLink,
          otpCode,
          year: new Date().getFullYear().toString(),
        }
      );
    } catch (emailError: any) {
      //  log the failure but do NOT rollback DB
      console.error(`Failed to send verification email to ${email}:`, emailError.message);
    }

    // Return DB info immediately
    return {
      id: eventOwner.id,
      email: eventOwner.email,
      ownerType: eventOwner.ownerType,
      role: eventOwner.role,
      emailToken, // only for testing, remove in production
      phoneOTP,   // only for testing, remove in production
    };
  }

  /*** Verify email */
  async verifyEmail(token: string) {
    const owner = await prisma.eventOwner.findFirst({
      where: { emailVerifyToken: token, emailTokenExpiry: { gt: new Date() } },
    });
    if (!owner) throw new Error("Invalid or expired email token");

    await prisma.eventOwner.update({
      where: { id: owner.id },
      data: {
        emailVerified: true,
        emailVerifyToken: null,
        emailTokenExpiry: null,
      },
    });

    return { message: "Email verified successfully" };
  }

  /*** Verify phone OTP */
  async verifyPhone(ownerId: string, code: string) {
    const owner = await prisma.eventOwner.findUnique({ where: { id: ownerId } });
    if (
      !owner ||
      owner.phoneVerifyCode !== code ||
      (owner.phoneCodeExpiry && owner.phoneCodeExpiry < new Date())
    )
      throw new Error("Invalid or expired phone OTP");

    await prisma.eventOwner.update({
      where: { id: ownerId },
      data: {
        phoneVerified: true,
        phoneVerifyCode: null,
        phoneCodeExpiry: null,
      },
    });

    return { message: "Phone verified successfully" };
  }

  /*** Resend email verification link */
async resendVerificationEmail(email: string) {
    // Find the event owner
    const owner = await prisma.eventOwner.findUnique({ where: { email } });
    if (!owner) throw new Error("Event owner not found");
  
    // If already verified, no need to resend
    if (owner.emailVerified) {
      return { message: "Email is already verified" };
    }
  
    // Generate new token & expiry
    const emailToken = VerificationUtil.generateEmailToken();
    const emailExpiry = VerificationUtil.getExpiry(15); // 15 minutes
  
    // Update owner with new token
    await prisma.eventOwner.update({
      where: { id: owner.id },
      data: {
        emailVerifyToken: emailToken,
        emailTokenExpiry: emailExpiry,
      },
    });
  
    // Build verification link
    const baseUrl = process.env.APP_BASE_URL;
    if (!baseUrl) throw new Error("APP_BASE_URL is not defined in environment variables");
    const verifyLink = `${baseUrl}/verify-email?token=${emailToken}`;
  
    // Send email via EmailClient
    await emailClient.sendTemplateEmail(
      email,
      "Verify Your Event Owner Account",
      "eventOwnerRegistration", 
      {
        name: owner.firstName || owner.companyName || "User",
        verifyLink,
        year: new Date().getFullYear().toString(),
      }
    );
  
    return { 
        message: "Verification email resent successfully",
        emailToken
    };
  }
  

  /*** Login EventOwner (only after email verification) */
  async login(email: string, password: string) {
    const owner = await prisma.eventOwner.findUnique({ where: { email } });
    if (!owner) throw new Error("Invalid email or password");
    if (!owner.emailVerified) throw new Error("Email not verified");

    const isPasswordValid = await HashUtil.comparePassword(password, owner.password);
    if (!isPasswordValid) throw new Error("Invalid email or password");

    const token = JwtUtil.generateToken({
      id: owner.id,
      email: owner.email,
      role: owner.role,
    });

    return {
      token,
      eventOwner: {
        id: owner.id,
        email: owner.email,
        ownerType: owner.ownerType,
        role: owner.role,
      },
    };
  }
}
