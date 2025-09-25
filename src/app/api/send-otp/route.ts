import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    if (!phone) return NextResponse.json({ success: false, error: "Phone number required" }, { status: 400 });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to Supabase (or in-memory for testing)
    const supabase = createClient();
    const { error } = await supabase
      .from("user_otps")
      .upsert({ phone, otp, expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString() }); // 5 min expiry
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    // TODO: Send OTP via SMS provider
    console.log(`OTP for ${phone}: ${otp}`);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
