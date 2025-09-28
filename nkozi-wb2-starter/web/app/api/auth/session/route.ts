export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
import { upsertUser } from "@/lib/db";
import type { Address } from "@/lib/types";

export async function POST(req: NextRequest) {
  const data = await req.json().catch(()=> ({}));
  const walletAddress = (data.walletAddress || req.headers.get("x-address")) as Address | undefined;
  if (!walletAddress) return NextResponse.json({ error: "missing walletAddress" }, { status: 400 });
  const username = data.username as string | undefined;
  const user = await upsertUser({ walletAddress, username, verified: false });
  return NextResponse.json({ user });
}
