export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
import { getTrack, updateTrack } from "@/lib/db";

export async function GET(_: NextRequest, { params }: { params: { id: string }}) {
  const t = await getTrack(params.id);
  if (!t) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ track: t });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string }}) {
  const data = await req.json().catch(()=> ({}));
  if (data.like === true) {
    const t = await getTrack(params.id);
    if (!t) return NextResponse.json({ error: "not found" }, { status: 404 });
    const nt = await updateTrack(params.id, { likes: (t.likes || 0) + 1 });
    return NextResponse.json({ track: nt });
  }
  return NextResponse.json({ ok: true });
}
