import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "supersecret";

export async function POST(req: NextRequest) {
  try {
    const { phone, passcode } = await req.json();
    if (!phone || !passcode) return NextResponse.json({ success: false, error: "Phone and passcode required" }, { status: 400 });

    const supabase = createClient();
    const { data, error } = await supabase.from("user_passcodes").select("*").eq("phone", phone).single();

    if (error || !data) return NextResponse.json({ success: false, error: "Invalid phone or passcode" }, { status: 401 });

    const isMatch = await bcrypt.compare(passcode, data.passcode_hash);
    if (!isMatch) return NextResponse.json({ success: false, error: "Invalid phone or passcode" }, { status: 401 });

    const token = jwt.sign({ phone }, JWT_SECRET, { expiresIn: "7d" });

    // Optionally, set httpOnly cookie
    return NextResponse.json({ success: true, token });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
