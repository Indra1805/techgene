import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { passcode } = await req.json();
    if (!passcode) return NextResponse.json({ success: false, error: "Passcode required" }, { status: 400 });

    const { data, error } = await supabase.from("user_passcodes").select("*").limit(1).single();

    if (error || !data) return NextResponse.json({ success: false, error: "User not found" }, { status: 400 });

    const isValid = await bcrypt.compare(passcode, data.passcode_hash);
    if (!isValid) return NextResponse.json({ success: false, error: "Incorrect passcode" }, { status: 400 });

    return NextResponse.json({ success: true, user: { id: data.user_id } });
  } catch (err: any) {
    console.error("Login passcode error:", err);
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
