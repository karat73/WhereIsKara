import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase/admin";

const WARNING_THRESHOLD = 25_000;
const URGENT_THRESHOLD = 40_000;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const month = new Date().toISOString().slice(0, 7);

  const { data: row, error } = await supabaseAdmin
    .from("map_loads")
    .select("*")
    .eq("month", month)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!row) {
    return NextResponse.json({ ok: true, count: 0, month });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const alertTo = process.env.ALERT_EMAIL_TO;

  async function sendAlert(subject: string, body: string): Promise<string | null> {
    const missing: string[] = [];
    if (!resendApiKey) missing.push("RESEND_API_KEY");
    if (!alertTo) missing.push("ALERT_EMAIL_TO");
    if (!resendApiKey || !alertTo) return `Missing env var(s): ${missing.join(", ")}`;

    const resend = new Resend(resendApiKey);
    const result = await resend.emails.send({
      from: "Where in the world is Kara <onboarding@resend.dev>",
      to: alertTo,
      subject,
      text: body,
    });
    return result.error ? result.error.message : null;
  }

  let notified: "40k" | "25k" | null = null;
  let sendError: string | null = null;

  if (row.count >= URGENT_THRESHOLD && !row.notified_40k) {
    sendError = await sendAlert(
      "Mapbox usage: switch now",
      `Map loads for ${month} have passed ${URGENT_THRESHOLD.toLocaleString()} (currently ${row.count.toLocaleString()}). Time to switch to OSM to avoid Mapbox billing.`
    );
    if (!sendError) {
      await supabaseAdmin.from("map_loads").update({ notified_40k: true }).eq("month", month);
      notified = "40k";
    }
  } else if (row.count >= WARNING_THRESHOLD && !row.notified_25k) {
    sendError = await sendAlert(
      "Mapbox usage: early warning",
      `Map loads for ${month} have passed ${WARNING_THRESHOLD.toLocaleString()} (currently ${row.count.toLocaleString()}). Worth considering a switch to OSM soon.`
    );
    if (!sendError) {
      await supabaseAdmin.from("map_loads").update({ notified_25k: true }).eq("month", month);
      notified = "25k";
    }
  }

  if (sendError) {
    return NextResponse.json({ ok: false, count: row.count, month, sendError }, { status: 500 });
  }
  return NextResponse.json({ ok: true, count: row.count, month, notified });
}
