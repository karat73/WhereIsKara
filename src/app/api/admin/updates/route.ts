import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isValidSessionToken, COOKIE_NAME } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { pickRepresentativeVisit } from "@/lib/status";
import type { Visit } from "@/lib/types";

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

  const [{ data: visitRows, error: visitsError }, { data: cityRow, error: cityError }] =
    await Promise.all([
      supabaseAdmin.from("visits").select("*").eq("city_id", cityId),
      supabaseAdmin.from("cities").select("timezone").eq("id", cityId).maybeSingle(),
    ]);

  if (visitsError) {
    return NextResponse.json({ error: visitsError.message }, { status: 500 });
  }
  if (cityError || !cityRow) {
    return NextResponse.json({ error: cityError?.message ?? "City not found" }, { status: 400 });
  }

  const visits: Visit[] = (visitRows ?? []).map((v) => ({
    ...v,
    id: String(v.id),
    city_id: String(v.city_id),
  }));
  const visit = pickRepresentativeVisit(visits, cityRow.timezone);
  if (!visit) {
    return NextResponse.json({ error: "This city has no visits yet" }, { status: 400 });
  }

  const now = new Date();
  const todayDate = now.toISOString().slice(0, 10);

  // One running update per visit: edit the existing row if there is one,
  // rather than accumulating a new row every check-in.
  const { data: existing, error: selectError } = await supabaseAdmin
    .from("daily_updates")
    .select("id")
    .eq("visit_id", visit.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (selectError) {
    return NextResponse.json({ error: selectError.message }, { status: 500 });
  }

  // Editing only ever changes the caption text - never date or created_at,
  // so correcting an old entry can't move it in the timeline or change its
  // displayed date (that's what "created_at" is for: when it was first
  // posted, never touched again).
  const { error } = existing
    ? await supabaseAdmin.from("daily_updates").update({ caption: caption.trim() }).eq("id", existing.id)
    : await supabaseAdmin.from("daily_updates").insert({
        visit_id: visit.id,
        date: todayDate,
        caption: caption.trim(),
      });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
