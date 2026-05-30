"use client";

import { useEffect, useState } from "react";

export function KeyboardDemo() {
  const [pos, setPos] = useState({ x: 60, y: 30 });
  const [key, setKey] = useState("");
  useEffect(() => {
    const seq = [
      { x: 60, y: 30, k: "" }, { x: 80, y: 30, k: "→" }, { x: 100, y: 30, k: "→" },
      { x: 100, y: 50, k: "↓" }, { x: 80, y: 50, k: "←" }, { x: 60, y: 30, k: "↑" },
    ];
    let i = 0;
    const id = setInterval(() => { i = (i + 1) % seq.length; setPos({ x: seq[i].x, y: seq[i].y }); setKey(seq[i].k); }, 900);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="relative h-[100px] w-full overflow-hidden rounded-lg border border-rail bg-surface">
      <div className="absolute rounded-md border-2 border-electric/60 bg-electric/10 shadow-[0_0_10px_rgba(59,158,255,0.2)] transition-all duration-400" style={{ left: pos.x, top: pos.y, width: 36, height: 30, transitionTimingFunction: "cubic-bezier(0.2,0,0,1)" }}>
        <div className="flex h-full items-center justify-center text-[8px] text-electric">⌨</div>
      </div>
      {key && <div className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded border border-rail bg-surface text-xs text-frost">{key}</div>}
      <div className="absolute top-2 right-2 text-[7px] text-fog/50">Tab + Arrows</div>
    </div>
  );
}
