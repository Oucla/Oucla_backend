import "dotenv/config"

import jwt from "jsonwebtoken";

export class JwtUtil {
  static generateToken(payload: object): string {
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "1d" });
  }

  static verifyToken(token: string): any {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  }
}
