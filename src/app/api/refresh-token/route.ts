import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("Missing JWT_SECRET");

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refresh")?.value;
  if (!refreshToken) return NextResponse.json({ success: false }, { status: 401 });

  try {
    const payload = jwt.verify(refreshToken, JWT_SECRET) as { phone: string };
    const newAccessToken = jwt.sign({ phone: payload.phone }, JWT_SECRET, { expiresIn: "1d" });

    const res = NextResponse.json({ success: true, accessToken: newAccessToken });
    res.cookies.set("auth", newAccessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 24 * 60 * 60 });

    return res;
  } catch {
    return NextResponse.json({ success: false }, { status: 401 });
  }
}
