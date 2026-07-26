import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST() {
  const month = new Date().toISOString().slice(0, 7); // 'YYYY-MM'

  const { error } = await supabaseAdmin.rpc("increment_map_loads", { p_month: month });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
