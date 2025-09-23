// src/app/api/send-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phone = body?.phone as string | undefined;
    if (!phone) {
      return NextResponse.json({ success: false, error: "Phone number required" }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires_at = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const supabase = createClient();
    const { error } = await supabase.from("otps").insert({ phone, otp, expires_at });

    if (error) throw new Error(error.message);

    const apiKey = process.env.TWO_FACTOR_API_KEY;
    if (!apiKey) {
      throw new Error("TWO_FACTOR_API_KEY not configured.");
    }

    const res = await fetch(
      `https://2factor.in/API/V1/${apiKey}/SMS/${phone}/${otp}/TECHGE`,
      { method: "GET" }
    );

    const data = await res.json();
    if (data?.Status !== "Success") {
      return NextResponse.json({ success: false, error: "Failed to send OTP" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
