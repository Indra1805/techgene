// src/app/api/courses/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

type Course = {
  id: string;
  title: string;
  description: string;
  image_url?: string;
};

export async function GET() {
  const supabase = createClient(); // ✅ call the function

  const { data, error } = await supabase
    .from<"courses", Course>("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, courses: data });
}
