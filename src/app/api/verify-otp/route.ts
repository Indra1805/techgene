import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

type VerifyOtpRequest = {
  phone: string;
  otp: string;
};

export async function POST(req: NextRequest) {
  try {
    const body: VerifyOtpRequest = await req.json();
    const { phone, otp } = body;

    if (!phone || !otp) {
      return NextResponse.json({ success: false, error: "Phone and OTP are required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("otps")
      .select("*")
      .eq("phone", phone)
      .eq("otp", otp)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: "Invalid OTP" }, { status: 400 });
    }

    // Optional: delete used OTP
    await supabase.from("otps").delete().eq("id", data.id);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
