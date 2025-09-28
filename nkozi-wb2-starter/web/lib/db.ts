import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import type { User, Track, ListenLog } from "@/lib/types";

const BASE = process.env.DB_DIR || path.join(process.cwd(), "data");
const F_USERS = path.join(BASE, "users.json");
const F_TRACKS = path.join(BASE, "tracks.json");
const F_LISTENS = path.join(BASE, "listens.json");

async function ensure() {
  await fsp.mkdir(BASE, { recursive: true });
  const init = async (p: string, v: unknown) => {
    if (!fs.existsSync(p)) await fsp.writeFile(p, JSON.stringify(v, null, 2));
  };
  await init(F_USERS, []);
  await init(F_TRACKS, []);
  await init(F_LISTENS, []);
}

async function readJSON<T>(p: string): Promise<T> {
  await ensure();
  return JSON.parse(await fsp.readFile(p, "utf8")) as T;
}

async function writeJSON<T>(p: string, data: T): Promise<void> {
  await ensure();
  const tmp = p + ".tmp";
  await fsp.writeFile(tmp, JSON.stringify(data, null, 2));
  await fsp.rename(tmp, p);
}

export async function upsertUser(partial: Partial<User> & { walletAddress: User["walletAddress"] }): Promise<User> {
  const list = await readJSON<User[]>(F_USERS);
  const i = list.findIndex(u => u.walletAddress.toLowerCase() === partial.walletAddress.toLowerCase());
  if (i === -1) {
    const nu: User = {
      walletAddress: partial.walletAddress,
      username: partial.username,
      verified: !!partial.verified,
      artist: !!partial.artist,
      earningsWLD: partial.earningsWLD ?? 0
    };
    list.push(nu);
    await writeJSON(F_USERS, list);
    return nu;
  } else {
    const merged: User = { ...list[i], ...partial };
    list[i] = merged;
    await writeJSON(F_USERS, list);
    return merged;
  }
}

export async function getUser(addr: string): Promise<User | undefined> {
  const list = await readJSON<User[]>(F_USERS);
  return list.find(u => u.walletAddress.toLowerCase() === addr.toLowerCase());
}

export async function listTracks(): Promise<Track[]> {
  return (await readJSON<Track[]>(F_TRACKS)).sort((a,b)=>b.createdAt-a.createdAt);
}

export async function getTrack(id: string): Promise<Track | undefined> {
  const all = await readJSON<Track[]>(F_TRACKS);
  return all.find(t => t.id === id);
}

export async function addTrack(t: Omit<Track, "id" | "createdAt" | "likes" | "comments" | "plays">): Promise<Track> {
  const all = await readJSON<Track[]>(F_TRACKS);
  const nt: Track = { id: randomUUID(), createdAt: Date.now(), likes: 0, comments: [], plays: 0, ...t };
  all.push(nt);
  await writeJSON(F_TRACKS, all);
  return nt;
}

export async function updateTrack(id: string, patch: Partial<Track>): Promise<Track | undefined> {
  const all = await readJSON<Track[]>(F_TRACKS);
  const i = all.findIndex(t => t.id === id);
  if (i === -1) return undefined;
  all[i] = { ...all[i], ...patch };
  await writeJSON(F_TRACKS, all);
  return all[i];
}

export async function pushComment(id: string, c: Track["comments"][number]) {
  const t = await getTrack(id);
  if (!t) return;
  t.comments.push(c);
  await updateTrack(id, { comments: t.comments });
}

export async function incPlay(id: string) {
  const t = await getTrack(id);
  if (!t) return;
  t.plays += 1;
  await updateTrack(id, { plays: t.plays });
}

export async function logListen(entry: Omit<ListenLog, "id" | "ts">): Promise<ListenLog> {
  const all = await readJSON<ListenLog[]>(F_LISTENS);
  const nl: ListenLog = { id: randomUUID(), ts: Date.now(), ...entry };
  all.push(nl);
  await writeJSON(F_LISTENS, all);
  return nl;
}

export async function listListensByAddress(addr: string): Promise<ListenLog[]> {
  const all = await readJSON<ListenLog[]>(F_LISTENS);
  return all.filter(l => l.address.toLowerCase() === addr.toLowerCase());
}
