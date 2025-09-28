"use client";
import { useEffect, useState } from "react";
function useAddress() {
  const [addr, setAddr] = useState("");
  useEffect(() => { setAddr(localStorage.getItem("addr") || "0xabc..."); }, []);
  return { addr, set: (v:string)=>{ localStorage.setItem("addr", v); setAddr(v);} };
}
export default function Dashboard() {
  const { addr, set } = useAddress();
  const [data, setData] = useState<{ wldAccrued: number; dailyRemaining: number } | null>(null);
  useEffect(()=> { if (!addr) return; fetch(`/api/rewards?address=${addr}`).then(r=>r.json()).then(setData).catch(()=> setData(null)); }, [addr]);
  return (
    <main style={{ maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: 20, fontWeight: 600 }}>Rewards Dashboard</h1>
      <label>Your wallet/address</label>
      <input style={{ width: "100%", padding: 8, border: "1px solid #ccc" }} value={addr} onChange={e=>set(e.target.value)} placeholder="0x..." />
      {data ? (
        <div style={{ border: "1px solid #eee", padding: 12, borderRadius: 8, marginTop: 8 }}>
          <div><b>Listener WLD accrued:</b> {data.wldAccrued}</div>
          <div><b>Daily remaining cap:</b> {data.dailyRemaining}</div>
        </div>
      ) : <p>Enter address to load rewards.</p>}
    </main>
  );
}
