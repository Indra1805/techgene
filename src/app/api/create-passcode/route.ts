import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

type CreatePasscodeRequest = {
  user_id: string;
  passcode: string; // 6-digit
};

export async function POST(req: NextRequest) {
  try {
    const body: CreatePasscodeRequest = await req.json();
    const { user_id, passcode } = body;

    if (!user_id || !passcode) {
      return NextResponse.json(
        { success: false, error: "User ID and passcode required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("passcodes")
      .upsert({ user_id, passcode });

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
