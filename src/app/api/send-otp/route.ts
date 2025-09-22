import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const { phone }: { phone?: string } = await req.json();
    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Phone number required" },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires_at = new Date(Date.now() + 5 * 60 * 1000);

    // Save OTP in Supabase
    const { error } = await supabase
      .from("otps")
      .insert({ phone, otp, expires_at });
    if (error) throw new Error(error.message);

    // Send OTP via 2Factor.in API
    const res = await fetch(
      `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/${phone}/${otp}/Techgene`,
      { method: "GET" }
    );

    type TwoFactorResponse = { Status: string; Details?: string };
    const data: TwoFactorResponse = await res.json();

    if (data.Status !== "Success") {
      return NextResponse.json(
        { success: false, error: "Failed to send OTP" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
