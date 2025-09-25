// app/api/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    const payload = verifyToken(token);
    console.log("🍪 Cookies on /api/me:", req.cookies.getAll());

    if (!payload) return NextResponse.json({ loggedIn: false });

    return NextResponse.json({ loggedIn: true, user: { phone: payload.phone } });
  } catch {
    return NextResponse.json({ loggedIn: false });
  }
}
