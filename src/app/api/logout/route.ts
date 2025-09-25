import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const csrfHeader = req.headers.get("x-csrf-token");
  const csrfCookie = req.cookies.get("csrf-token")?.value;

  if (!csrfHeader || csrfHeader !== csrfCookie) {
    return NextResponse.json({ success: false, error: "CSRF validation failed" }, { status: 403 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set({
    name: "auth",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
}
