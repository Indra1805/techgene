import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const { phone, token } = await req.json();
    if (!phone || !token) return NextResponse.json({ success: false, error: "Phone and OTP required" }, { status: 400 });

    const supabase = createClient();
    const { data, error } = await supabase
      .from("user_otps")
      .select("*")
      .eq("phone", phone)
      .single();

    if (error || !data) return NextResponse.json({ success: false, error: "Invalid OTP" }, { status: 401 });

    const now = new Date();
    if (data.expires_at && new Date(data.expires_at) < now) {
      return NextResponse.json({ success: false, error: "OTP expired" }, { status: 401 });
    }

    if (data.otp !== token) return NextResponse.json({ success: false, error: "Incorrect OTP" }, { status: 401 });

    // OTP verified → delete it
    await supabase.from("user_otps").delete().eq("phone", phone);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
