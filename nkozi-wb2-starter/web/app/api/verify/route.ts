export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
import { getUser, upsertUser } from "@/lib/db";

export async function POST(req: NextRequest) {
  const data = await req.json().catch(()=> ({}));
  const walletAddress = (data.walletAddress || req.headers.get("x-address")) as string | undefined;
  if (!walletAddress) return NextResponse.json({ error: "missing walletAddress" }, { status: 400 });

  const user = await getUser(walletAddress);
  if (!user) return NextResponse.json({ error: "user not found" }, { status: 404 });
  const updated = await upsertUser({ walletAddress, verified: true });
  return NextResponse.json({ user: updated, status: 200 });
}
