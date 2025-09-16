import * as bcrypt from "bcrypt";

export class HashUtil {
  private static readonly SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

  static async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, this.SALT_ROUNDS);
    } catch (err) {
      throw new Error("Failed to hash password");
    }
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (err) {
      throw new Error("Failed to compare password");
    }
  }
}
