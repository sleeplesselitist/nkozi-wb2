export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
import { getUser, listListensByAddress } from "@/lib/db";
function todayKey(ts: number) { return new Date(ts).toISOString().slice(0,10); }
export async function GET(req: NextRequest) {
  const address = (new URL(req.url).searchParams.get("address") || req.headers.get("x-address")) as string | null;
  if (!address) return NextResponse.json({ error: "missing address" }, { status: 400 });
  const user = await getUser(address);
  if (!user) return NextResponse.json({ error: "user not found" }, { status: 404 });
  const CAP = Number(process.env.DAILY_CAP_WLD || 5);
  const today = todayKey(Date.now());
  const logs = await listListensByAddress(address);
  const earnedToday = logs.filter(l => todayKey(l.ts) === today).reduce((a,b)=> a + (b.awardedWLD || 0), 0);
  return NextResponse.json({ wldAccrued: Number(user.earningsWLD || 0), dailyRemaining: Math.max(0, CAP - earnedToday) });
}
