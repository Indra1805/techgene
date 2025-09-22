import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // previously: const data = body;
    return NextResponse.json({ success: true, body });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
