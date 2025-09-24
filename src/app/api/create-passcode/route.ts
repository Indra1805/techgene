import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { phone, passcode } = await req.json();
    if (!phone || !passcode) return NextResponse.json({ success: false, error: "Phone and passcode required" }, { status: 400 });

    const hashedPasscode = await bcrypt.hash(passcode, 10);
    const supabase = createClient();
    const { error } = await supabase.from("user_passcodes").upsert([{ phone, passcode_hash: hashedPasscode }], { onConflict: "phone" });

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
