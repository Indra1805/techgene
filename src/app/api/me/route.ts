import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    let token = getTokenFromRequest(req);
    let payload = verifyToken(token);

    // If access token expired, try refresh
    if (!payload) {
      const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/refresh-token`, { method: "POST", credentials: "include" });
      if (refreshRes.ok) {
        const newToken = refreshRes.headers.get("set-cookie");
        payload = verifyToken(newToken);
      }
    }

    if (!payload) return NextResponse.json({ loggedIn: false });
    return NextResponse.json({ loggedIn: true, user: { phone: payload.phone } });
  } catch {
    return NextResponse.json({ loggedIn: false });
  }
}
