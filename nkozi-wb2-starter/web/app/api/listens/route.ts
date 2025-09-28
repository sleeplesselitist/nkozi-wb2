export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
import { getUser, upsertUser, logListen, incPlay, listListensByAddress } from "@/lib/db";
function todayKey(ts: number) { return new Date(ts).toISOString().slice(0,10); }
export async function POST(req: NextRequest) {
  const data = await req.json().catch(()=> ({}));
  const walletAddress = (data.walletAddress || req.headers.get("x-address")) as string | undefined;
  const { trackId, elapsedSec, full } = data as { trackId?: string; elapsedSec?: number; full?: boolean };
  if (!walletAddress) return NextResponse.json({ error: "missing walletAddress" }, { status: 400 });
  if (!trackId) return NextResponse.json({ error: "missing trackId" }, { status: 400 });
  const user = await getUser(walletAddress);
  if (!user) return NextResponse.json({ error: "user not found" }, { status: 404 });
  const PER = Number(process.env.REWARD_PER_LISTEN_WLD || 0.3);
  const CAP = Number(process.env.DAILY_CAP_WLD || 5);
  let credited = false, awarded = 0;
  if (user.verified && (full || (elapsedSec || 0) >= 30)) {
    const logs = await listListensByAddress(walletAddress);
    const today = todayKey(Date.now());
    const earnedToday = logs.filter(l => todayKey(l.ts) === today).reduce((a,b)=> a + (b.awardedWLD || 0), 0);
    if (earnedToday < CAP) {
      credited = true;
      awarded = Math.min(PER, CAP - earnedToday);
      await upsertUser({ walletAddress, earningsWLD: (user.earningsWLD || 0) + awarded });
    }
  }
  if (full) await incPlay(trackId);
  const saved = await logListen({ address: walletAddress, trackId, elapsedSec: Number(elapsedSec || 0), full: !!full, credited, awardedWLD: credited ? awarded : 0 });
  return NextResponse.json({ credited, awardedWLD: saved.awardedWLD });
}
