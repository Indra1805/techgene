import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const { phone, token } = await req.json();
    if (!phone || !token)
      return NextResponse.json({ success: false, error: "Phone and OTP required" }, { status: 400 });

    const { data, error } = await supabase
      .from("otps")
      .select("*")
      .eq("phone", phone)
      .eq("otp", token)
      .gte("expires_at", new Date())
      .limit(1)
      .single();

    if (error || !data) return NextResponse.json({ success: false, error: "Invalid or expired OTP" }, { status: 400 });

    await supabase.from("otps").delete().eq("id", data.id); // delete used OTP

    return NextResponse.json({ success: true, user: { id: phone } });
  } catch (err: any) {
    console.error("Verify OTP error:", err);
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
