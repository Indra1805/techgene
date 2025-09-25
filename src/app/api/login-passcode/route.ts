import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("Missing JWT_SECRET");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phone = (body?.phone ?? "").toString().trim();
    const passcode = (body?.passcode ?? "").toString().trim();

    if (!phone || !/^\d{6}$/.test(passcode))
      return NextResponse.json({ success: false, error: "Phone and 6-digit passcode required" }, { status: 400 });

    const supabase = createClient();
    const { data, error } = await supabase
      .from("user_passcodes")
      .select("*")
      .eq("phone", phone)
      .single();

    if (error || !data)
      return NextResponse.json({ success: false, error: "Invalid phone or passcode" }, { status: 401 });

    const isMatch = await bcrypt.compare(passcode, data.passcode_hash);
    if (!isMatch)
      return NextResponse.json({ success: false, error: "Invalid phone or passcode" }, { status: 401 });

    // JWT Tokens
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("❌ Missing JWT_SECRET in environment");
    }
    const accessToken = jwt.sign({ phone }, JWT_SECRET, { expiresIn: "1d" });
    const refreshToken = jwt.sign({ phone }, JWT_SECRET, { expiresIn: "7d" });

    // CSRF Token
    const csrfToken = crypto.randomUUID();

    const res = NextResponse.json({ success: true });
    res.cookies.set("auth", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 24 * 60 * 60 });
    res.cookies.set("refresh", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 7 * 24 * 60 * 60 });
    res.cookies.set("csrf-token", csrfToken, { httpOnly: false, secure: process.env.NODE_ENV === "production", path: "/",sameSite: "lax",  maxAge: 7 * 24 * 60 * 60 });

    return res;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
