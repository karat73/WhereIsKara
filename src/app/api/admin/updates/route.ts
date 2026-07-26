import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isValidSessionToken, COOKIE_NAME } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!isValidSessionToken(token)) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const cityId = body?.cityId;
  const date = body?.date;
  const caption = body?.caption;

  if (typeof cityId !== "string" || !cityId) {
    return NextResponse.json({ error: "cityId is required" }, { status: 400 });
  }
  if (typeof caption !== "string" || !caption.trim()) {
    return NextResponse.json({ error: "caption is required" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("daily_updates").insert({
    city_id: cityId,
    date: typeof date === "string" && date ? date : new Date().toISOString(),
    caption: caption.trim(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
