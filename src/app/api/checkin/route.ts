import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isValidSessionToken, COOKIE_NAME } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase/admin";

// Authorized either by an authenticated admin session (the browser button
// on /admin) or a shared-secret header (so this can be hit directly, e.g.
// from a phone shortcut, without a browser session).
async function isAuthorized(req: NextRequest): Promise<boolean> {
  const secretHeader = req.headers.get("x-checkin-secret");
  const expectedSecret = process.env.CHECKIN_SECRET;
  if (expectedSecret && secretHeader === expectedSecret) return true;

  const cookieStore = await cookies();
  return isValidSessionToken(cookieStore.get(COOKIE_NAME)?.value);
}

export async function POST(req: NextRequest) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date().toISOString();
  const { error } = await supabaseAdmin
    .from("trip")
    .update({ last_checked_in: now })
    .not("id", "is", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, last_checked_in: now });
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("trip")
    .select("last_checked_in")
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ last_checked_in: data?.last_checked_in ?? null });
}
