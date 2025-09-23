// src/app/api/verify-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phone = body?.phone as string | undefined;
    const token = body?.token as string | undefined;

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

    // delete used OTP
    await supabase.from("otps").delete().eq("id", data.id);

    // return a "user" object — I assume phone is your user id; adapt as needed
    return NextResponse.json({ success: true, user: { id: phone } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
