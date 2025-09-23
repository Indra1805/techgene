// src/app/api/create-passcode/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

type CreatePasscodeRequest = {
  user_id: string;
  passcode: string; // 6-digit
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreatePasscodeRequest;
    const { user_id, passcode } = body;

    if (!user_id || !passcode) {
      return NextResponse.json(
        { success: false, error: "User ID and passcode required" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const { error } = await supabase.from("passcodes").upsert({ user_id, passcode });

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
