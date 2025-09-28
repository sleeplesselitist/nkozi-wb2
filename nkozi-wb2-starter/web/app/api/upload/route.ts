export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
import { addTrack, getUser, upsertUser } from "@/lib/db";
import type { Address } from "@/lib/types";

export async function POST(req: NextRequest) {
  const data = await req.json().catch(()=> ({}));
  const walletAddress = (data.walletAddress || req.headers.get("x-address")) as Address | undefined;
  if (!walletAddress) return NextResponse.json({ error: "missing walletAddress" }, { status: 400 });

  const user = await getUser(walletAddress);
  if (!user || !user.verified) return NextResponse.json({ error: "not verified" }, { status: 401 });
  const title = (data.title || "").trim();
  const audioUrl = (data.audioUrl || "").trim();
  if (!title || !audioUrl) return NextResponse.json({ error: "missing title or audioUrl" }, { status: 400 });

  await upsertUser({ walletAddress, artist: true });
  const track = await addTrack({
    title, audioUrl, artistWallet: walletAddress,
    splitsBps: { artist: 6000, platform: 4000 }
  });
  return NextResponse.json({ track });
}
