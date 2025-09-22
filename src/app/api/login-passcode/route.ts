import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

type LoginPasscodeRequest = {
  user_id: string;
  passcode: string;
};

export async function POST(req: NextRequest) {
  try {
    const body: LoginPasscodeRequest = await req.json();
    const { user_id, passcode } = body;

    if (!user_id || !passcode) {
      return NextResponse.json({ success: false, error: "User ID and passcode required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("passcodes")
      .select("*")
      .eq("user_id", user_id)
      .eq("passcode", passcode)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: "Invalid passcode" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
