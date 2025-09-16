
import type { Request, Response, NextFunction } from "express";
import { z, ZodType } from "zod";

export const validateBody = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err: any) {
    return res.status(400).json({ error: err.errors ? err.errors : err.message });
  }
};
