import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { user_id, passcode } = await req.json();
    if (!user_id || !passcode)
      return NextResponse.json({ success: false, error: "User ID and passcode required" }, { status: 400 });

    const hashed = await bcrypt.hash(passcode, 10);

    const { error } = await supabase.from("user_passcodes").upsert({ user_id, passcode_hash: hashed });
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Create passcode error:", err);
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
