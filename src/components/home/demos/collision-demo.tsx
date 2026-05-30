"use client";

import { useEffect, useState } from "react";

export function CollisionDemo() {
  const [pushed, setPushed] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setPushed(p => !p), 1400);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="relative h-[100px] w-full overflow-hidden rounded-lg border border-rail bg-surface">
      <div className="absolute left-4 rounded-md border border-electric/40 bg-electric/10 transition-all duration-500" style={{ top: pushed ? 6 : 6, width: 60, height: 40, transitionTimingFunction: "cubic-bezier(0.2,0,0,1)" }}>
        <div className="flex h-full items-center justify-center text-[8px] text-electric/60">A</div>
      </div>
      <div className="absolute left-4 rounded-md border border-success/40 bg-success/10 transition-all duration-500" style={{ top: pushed ? 52 : 26, width: 60, height: 40, transitionTimingFunction: "cubic-bezier(0.2,0,0,1)" }}>
        <div className="flex h-full items-center justify-center text-[8px] text-success/60">B ↓</div>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-fog/50">{pushed ? "Resolved ✓" : "Overlapping..."}</div>
    </div>
  );
}
