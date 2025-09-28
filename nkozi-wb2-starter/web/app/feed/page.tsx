"use client";
import { useEffect, useState, useRef } from "react";
import { encodeFunctionData } from "viem";
import abi from "@/abi/RoyaltySplitter.json";
type Track = { id: string; title: string; audioUrl: string; likes: number; plays: number; };
function useAddress() {
  const [addr, setAddr] = useState("");
  useEffect(() => { setAddr(localStorage.getItem("addr") || "0xabc..."); }, []);
  return { addr, set: (v:string)=>{ localStorage.setItem("addr", v); setAddr(v);} };
}
export default function Feed() {
  const { addr, set } = useAddress();
  const [tracks, setTracks] = useState<Track[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [current, setCurrent] = useState<Track | null>(null);
  const [splitter, setSplitter] = useState<string>("");
  const [commentText, setCommentText] = useState<string>("");
  const load = async () => { const r = await fetch("/api/tracks").then(r=>r.json()); setTracks(r.tracks || []); };
  useEffect(()=>{ load(); }, []);
  const onEnded = async () => {
    if (!current) return;
    const r = await fetch("/api/listens", {
      method: "POST",
      headers: { "Content-Type":"application/json", "x-address": addr },
      body: JSON.stringify({ trackId: current.id, full: true, elapsedSec: Math.floor(audioRef.current?.duration || 0) })
    }).then(r=>r.json());
    if (r.credited) alert(`+${r.awardedWLD} WLD earned`);
  };
  return (
    <main style={{ maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 20, fontWeight: 600 }}>Discovery Feed</h1>
      <label>Your wallet/address</label>
      <input style={{ width: "100%", padding: 8, border: "1px solid #ccc" }} value={addr} onChange={e=>set(e.target.value)} placeholder="0x..." />
      <label style={{ display: "block", marginTop: 8 }}>Royalty Splitter Address (for tips)</label>
      <input style={{ width: "100%", padding: 8, border: "1px solid #ccc" }} value={splitter} onChange={e=>setSplitter(e.target.value)} placeholder="0x... (deployed RoyaltySplitter)" />
      {tracks.length === 0 && <p>No tracks yet. Upload one!</p>}
      {tracks.map(t => (
        <div key={t.id} style={{ border: "1px solid #eee", padding: 12, borderRadius: 8, marginTop: 8 }}>
          <div style={{ fontWeight: 600 }}>{t.title}</div>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>{t.audioUrl}</div>
          <button onClick={()=> (setCurrent(t))} style={{ padding: "6px 10px", background: "green", color: "white", border: 0, marginRight: 8 }}>Play</button>
          <button onClick={async ()=>{
            await fetch(`/api/tracks/${t.id}`, { method: "PATCH", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ like: true })});
            load();
          }} style={{ padding: "6px 10px", background: "#111", color: "white", border: 0 }}>Like ({t.likes})</button>
          <button onClick={async ()=>{
            try {
              if (!splitter) { alert("Enter Royalty Splitter address first"); return; }
              // Build a tx object for split() with 0.0001 ETH on chainId 4801
              const data = encodeFunctionData({ abi: abi as any, functionName: "split", args: [] });
              const valueWei = BigInt(Math.floor(0.0001 * 1e18));
              const tx = {
                to: splitter as `0x${string}`,
                data,
                value: valueWei.toString(),
                chainId: 4801
              };
              alert(`Tip tx (preview)\n${JSON.stringify(tx, null, 2)}`);
            } catch (e:any) {
              alert("Failed to build tx: " + (e?.message || String(e)));
            }
          }} style={{ padding: "6px 10px", background: "#2563eb", color: "white", border: 0, marginLeft: 8 }}>Tip 0.0001 ETH</button>
          <div style={{ marginTop: 8 }}>
            <input value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Add a comment" style={{ width: "70%", padding: 6, border: "1px solid #ccc", marginRight: 6 }} />
            <button onClick={async ()=>{
              if (!commentText.trim()) return;
              await fetch("/api/comments", { method: "POST", headers: {"Content-Type":"application/json", "x-address": addr }, body: JSON.stringify({ trackId: t.id, text: commentText })});
              setCommentText("");
              alert("Comment added");
            }} style={{ padding: "6px 10px", background: "#444", color: "white", border: 0 }}>Comment</button>
          </div>
        </div>
      ))}
      <div style={{ marginTop: 12 }}>
        <audio ref={audioRef} autoPlay={!!current} onEnded={onEnded} controls style={{ width: "100%" }}>
          {current && <source src={current.audioUrl} type="audio/mpeg" />}
        </audio>
      </div>
    </main>
  );
}
