// app/api/send-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phone = (body?.phone ?? "").toString().trim();
    if (!phone) {
      return NextResponse.json({ success: false, error: "Phone number required" }, { status: 400 });
    }

    // generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires_at = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

    const supabase = createClient();
    const { error } = await supabase.from("otps").insert([{ phone, otp, expires_at }]);
    if (error) throw new Error(error.message);

    const apiKey = process.env.TWO_FACTOR_API_KEY;
    if (!apiKey) throw new Error("TWO_FACTOR_API_KEY not configured");

    // Use your SMS provider endpoint. Example: 2factor.in
    const res = await fetch(`https://2factor.in/API/V1/${apiKey}/SMS/${phone}/${otp}/TECHGE`, {
      method: "GET",
    });
    const data = await res.json();

    if (!data || data?.Status !== "Success") {
      // optionally: remove record from otps if SMS failed
      await supabase.from("otps").delete().eq("phone", phone).eq("otp", otp);
      return NextResponse.json({ success: false, error: "Failed to send OTP" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
