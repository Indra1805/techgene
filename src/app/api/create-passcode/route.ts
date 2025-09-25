import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { phone, passcode } = await req.json();
    if (!phone || !passcode || passcode.length !== 6)
      return NextResponse.json({ success: false, error: "Invalid phone or passcode" }, { status: 400 });

    const supabase = createClient();
    const hashed = await bcrypt.hash(passcode, 10);

    const { error } = await supabase.from("user_passcodes").upsert({ phone, passcode_hash: hashed });
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
