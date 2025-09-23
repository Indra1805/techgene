// src/app/api/courses/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, courses: data ?? [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
