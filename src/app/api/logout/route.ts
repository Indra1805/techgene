// /api/logout/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ success: true });

  // Clear auth and refresh tokens
  res.cookies.set("auth", "", { httpOnly: true, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
  res.cookies.set("refresh", "", { httpOnly: true, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });

  return res;
}
