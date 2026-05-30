"use client";

import { useEffect, useState } from "react";

export function DragDemo() {
  const [pos, setPos] = useState({ x: 8, y: 8 });
  useEffect(() => {
    const frames = [
      { x: 8, y: 8 }, { x: 80, y: 30 }, { x: 140, y: 10 }, { x: 60, y: 50 }, { x: 8, y: 8 },
    ];
    let i = 0;
    const id = setInterval(() => { i = (i + 1) % frames.length; setPos(frames[i]); }, 1200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="relative h-[100px] w-full overflow-hidden rounded-lg border border-rail bg-surface">
      <div className="absolute h-9 w-14 rounded-md border border-electric/40 bg-electric/10 transition-all duration-700" style={{ left: pos.x, top: pos.y, transitionTimingFunction: "cubic-bezier(0.2,0,0,1)" }}>
        <div className="flex h-full items-center justify-center text-[8px] text-electric/60">↕ ↔</div>
      </div>
      <div className="absolute h-9 w-14 rounded-md border border-dashed border-electric/15 transition-all duration-1000 delay-100" style={{ left: pos.x + 5, top: pos.y + 5, opacity: 0.3, transitionTimingFunction: "cubic-bezier(0.2,0,0,1)" }} />
      <div className="absolute h-2.5 w-2.5 rounded-full bg-frost/80 shadow-[0_0_6px_#fff] transition-all duration-700" style={{ left: pos.x + 20, top: pos.y + 12, transitionTimingFunction: "cubic-bezier(0.2,0,0,1)" }} />
    </div>
  );
}
