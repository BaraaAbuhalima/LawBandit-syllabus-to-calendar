import { NextRequest, NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/google/client";

export async function GET(req: NextRequest) {
  const popup = req.nextUrl.searchParams.get("popup");
  try {
    const state = popup ? "popup" : undefined;
    const url = getAuthUrl(
      ["https://www.googleapis.com/auth/calendar.events"],
      state
    );
    if (popup) {
      return NextResponse.json({ url });
    }
    return NextResponse.redirect(url);
  } catch (err) {
    console.error("Auth URL generation failed", err);
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } =
      process.env;
    const missing = [
      !GOOGLE_CLIENT_ID && "GOOGLE_CLIENT_ID",
      !GOOGLE_CLIENT_SECRET && "GOOGLE_CLIENT_SECRET",
      !GOOGLE_REDIRECT_URI && "GOOGLE_REDIRECT_URI",
    ].filter(Boolean);
    return NextResponse.json(
      { error: "Failed to generate auth URL", missing },
      { status: 500 }
    );
  }
}
