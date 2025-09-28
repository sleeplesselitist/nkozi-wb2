export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
import { getUser, pushComment } from "@/lib/db";
import type { Address } from "@/lib/types";

export async function POST(req: NextRequest) {
  const data = await req.json().catch(()=> ({}));
  const walletAddress = (data.walletAddress || req.headers.get("x-address")) as Address | undefined;
  const { trackId, text } = data as { trackId?: string; text?: string };
  if (!walletAddress) return NextResponse.json({ error: "missing walletAddress" }, { status: 400 });
  if (!trackId || !text) return NextResponse.json({ error: "missing trackId or text" }, { status: 400 });
  const user = await getUser(walletAddress);
  if (!user) return NextResponse.json({ error: "user not found" }, { status: 404 });
  await pushComment(trackId, { address: walletAddress, text: String(text).slice(0, 280), ts: Date.now() });
  return NextResponse.json({ ok: true });
}
