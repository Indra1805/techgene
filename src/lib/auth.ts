import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("❌ Missing JWT_SECRET in environment");
}

export interface MyJwtPayload extends JwtPayload {
  phone: string;
}

/**
 * Extract JWT token from the request cookies
 */
export function getTokenFromRequest(req: NextRequest): string | null {
  const token = req.cookies.get("auth")?.value;
  return token || null;
}

/**
 * Verify JWT and return payload if valid
 */
export function verifyToken(token: string | null): MyJwtPayload | null {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown;
    if (
      decoded &&
      typeof decoded === "object" &&
      "phone" in decoded
    ) {
      return decoded as MyJwtPayload;
    }
    return null;
  } catch {
    return null;
  }
}
