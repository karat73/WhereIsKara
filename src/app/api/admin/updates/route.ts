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
  const caption = body?.caption;

  if (typeof cityId !== "string" || !cityId) {
    return NextResponse.json({ error: "cityId is required" }, { status: 400 });
  }
  if (typeof caption !== "string" || !caption.trim()) {
    return NextResponse.json({ error: "caption is required" }, { status: 400 });
  }

  const now = new Date();
  const todayDate = now.toISOString().slice(0, 10);

  // One running update per city: edit the existing row if there is one,
  // rather than accumulating a new row every check-in.
  const { data: existing, error: selectError } = await supabaseAdmin
    .from("daily_updates")
    .select("id")
    .eq("city_id", cityId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (selectError) {
    return NextResponse.json({ error: selectError.message }, { status: 500 });
  }

  const { error } = existing
    ? await supabaseAdmin
        .from("daily_updates")
        .update({ caption: caption.trim(), date: todayDate, created_at: now.toISOString() })
        .eq("id", existing.id)
    : await supabaseAdmin.from("daily_updates").insert({
        city_id: cityId,
        date: todayDate,
        caption: caption.trim(),
      });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
