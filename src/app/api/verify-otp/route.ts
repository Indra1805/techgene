// app/api/verify-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phone = (body?.phone ?? "").toString().trim();
    const token = (body?.token ?? "").toString().trim();

    if (!phone || !token) {
      return NextResponse.json({ success: false, error: "Phone and OTP required" }, { status: 400 });
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from("otps")
      .select("*")
      .eq("phone", phone)
      .eq("otp", token)
      .gte("expires_at", new Date().toISOString())
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: "Invalid or expired OTP" }, { status: 400 });
    }

    // delete used OTP(s)
    await supabase.from("otps").delete().eq("id", data.id);

    // success — return success and the phone (we'll redirect client with phone param)
    return NextResponse.json({ success: true, phone });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
