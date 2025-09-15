import crypto from "crypto";

export class VerificationUtil {
  static generateEmailToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  static generatePhoneOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static getExpiry(minutes: number): Date {
    return new Date(Date.now() + minutes * 60 * 1000);
  }
}
