import { z } from "zod";

export const registerSchema = z.object({
  ownerType: z.enum(["INDIVIDUAL", "COMPANY"]),
  email: z.string().min(1, "Email is required").refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), "Invalid email format"),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  companyName: z.string().optional(),
  contactPerson: z.string().optional(),
  phoneNumber: z.string().optional(),
});
