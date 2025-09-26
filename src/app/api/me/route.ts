import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    let payload = verifyToken(token);

    if (!payload) {
      // Try refresh token
      const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/refresh-token`, { method: "POST", credentials: "include" });
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        if (data.success) payload = verifyToken(data.accessToken);
      }
    }

    if (!payload) return NextResponse.json({ loggedIn: false });
    return NextResponse.json({ loggedIn: true, user: { phone: payload.phone } });
  } catch {
    return NextResponse.json({ loggedIn: false });
  }
}
