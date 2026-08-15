// src/middleware/privacy.ts
import { Request, Response, NextFunction } from "express";

const NAME_REGEX = /(?:ismim|mening ismim|muallif)\s+([A-ZА-Яa-zа-я']+)/gi;

export function sanitizePrivacy(req: Request, res: Response, next: NextFunction) {
  if (req.body && typeof req.body === "object") {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === "string") {
        // Shaxsiy ismlarni dinamik placeholderga almashtirish
        req.body[key] = req.body[key].replace(NAME_REGEX, "[Foydalanuvchi]");
      }
    }
  }
  next();
}
