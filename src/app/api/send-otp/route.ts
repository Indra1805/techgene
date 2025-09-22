// import { NextRequest, NextResponse } from "next/server";
// import { supabase } from "@/lib/supabaseClient";

// function generateOTP() {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// export async function POST(req: NextRequest) {
//   try {
//     const { phone } = await req.json();
//     if (!phone) return NextResponse.json({ success: false, error: "Phone number required" }, { status: 400 });

//     const otp = generateOTP();
//     const expires_at = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

//     const { error } = await supabase.from("otps").insert({ phone, otp, expires_at });
//     if (error) throw error;

//     console.log(`OTP for ${phone}: ${otp}`);

//     return NextResponse.json({ success: true });
//   } catch (err: any) {
//     console.error("Send OTP error:", err);
//     return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    if (!phone)
      return NextResponse.json({ success: false, error: "Phone number required" }, { status: 400 });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires_at = new Date(Date.now() + 5 * 60 * 1000);

    // Save OTP in Supabase
    const { error } = await supabase.from("otps").insert({ phone, otp, expires_at });
    if (error) throw error;

    // Send OTP via 2Factor.in API
    const res = await fetch(
      `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/${phone}/${otp}/Techgene`,
      { method: "GET" }
    );

    const data = await res.json();
    console.log("2Factor response:", data);

    if (data.Status !== "Success")
      return NextResponse.json({ success: false, error: "Failed to send OTP" }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Send OTP error:", err);
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
