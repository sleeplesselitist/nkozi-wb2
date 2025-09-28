"use client";
import { useEffect, useState } from "react";
function useAddress() {
  const [addr, setAddr] = useState("");
  useEffect(() => { setAddr(localStorage.getItem("addr") || "0xabc..."); }, []);
  return { addr, set: (v:string)=>{ localStorage.setItem("addr", v); setAddr(v);} };
}
export default function Upload() {
  const { addr, set } = useAddress();
  const [title, setTitle] = useState("");
  const [audioUrl, setAudio] = useState("");
  const call = async (path: string, body: unknown) => {
    const res = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json", "x-address": addr }, body: JSON.stringify(body) });
    return res.json();
  };
  const mockLogin = async () => { await call("/api/auth/session", { walletAddress: addr, username: "demo" }); await call("/api/verify", { walletAddress: addr }); alert("Verified (mock)"); };
  const submit = async () => {
    const r = await call("/api/upload", { title, audioUrl });
    if (r.track) alert("Uploaded!"); else alert("Upload failed: " + (r.error || "unknown"));
  };
  return (
    <main style={{ maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: 20, fontWeight: 600 }}>Upload (Verified only)</h1>
      <p style={{ margin: "6px 0 12px 0", fontSize: 13, opacity: 0.8 }}>Default revenue split: <b>60/20/20</b> (artist/fans/treasury) in product copy. Royalty demo contract tips use <b>60/40</b> (artist/treasury).</p>
      <label>Your wallet/address</label>
      <input style={{ width: "100%", padding: 8, border: "1px solid #ccc" }} value={addr} onChange={e=>set(e.target.value)} placeholder="0x..." />
      <div style={{ marginTop: 8 }}>
        <button onClick={mockLogin} style={{ padding: "8px 12px", background: "black", color: "white", border: 0 }}>Mock Login + Verify</button>
      </div>
      <label style={{ display: "block", marginTop: 16 }}>Title</label>
      <input style={{ width: "100%", padding: 8, border: "1px solid #ccc" }} value={title} onChange={e=>setTitle(e.target.value)} />
      <label style={{ display: "block", marginTop: 8 }}>Audio URL (mp3)</label>
      <input style={{ width: "100%", padding: 8, border: "1px solid #ccc" }} value={audioUrl} onChange={e=>setAudio(e.target.value)} placeholder="https://..." />
      <div style={{ marginTop: 12 }}>
        <button onClick={submit} style={{ padding: "8px 12px", background: "#2563eb", color: "white", border: 0 }}>Submit</button>
      </div>
    </main>
  );
}
