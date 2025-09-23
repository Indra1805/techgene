// src/app/api/login-passcode/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

type LoginPasscodeRequest = {
  user_id: string;
  passcode_hash: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LoginPasscodeRequest;
    const { user_id, passcode_hash } = body;

    if (!user_id || !passcode_hash) {
      return NextResponse.json(
        { success: false, error: "User ID and passcode required" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from("user_passcodes")
      .select("*")
      .eq("user_id", user_id)
      .eq("passcode_hash", passcode_hash)
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: "Invalid passcode" }, { status: 400 });
    }

    // Optionally: create a session, issue a cookie/JWT here.
    return NextResponse.json({ success: true, user: { id: user_id } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
