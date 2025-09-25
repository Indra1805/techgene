// app/api/create-passcode/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phone = (body?.phone ?? "").toString().trim();
    const passcode = (body?.passcode ?? "").toString().trim();

    if (!phone || !/^\d{6}$/.test(passcode)) {
      return NextResponse.json({ success: false, error: "Phone and 6-digit passcode required" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(passcode, SALT_ROUNDS);

    const supabase = createClient();
    const { error } = await supabase
      .from("user_passcodes")
      .upsert([{ phone, passcode_hash: hashed }], { onConflict: "phone" });

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
