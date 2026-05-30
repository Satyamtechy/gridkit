"use client";

import { useEffect, useState } from "react";

export function ResponsiveDemo() {
  const [bp, setBp] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setBp(b => (b + 1) % 3), 1800);
    return () => clearInterval(id);
  }, []);
  const cols = [3, 2, 1][bp];
  const labels = ["Desktop · 3 col", "Tablet · 2 col", "Mobile · 1 col"];
  return (
    <div className="relative h-[100px] w-full overflow-hidden rounded-lg border border-rail bg-surface p-2">
      <div className="absolute right-2 top-2 rounded-full border border-rail px-2 py-0.5 text-[7px] text-fog">{labels[bp]}</div>
      <div className="flex h-full flex-wrap gap-1 pt-4 transition-all duration-500">
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded border border-electric/30 bg-electric/8 transition-all duration-500" style={{ width: `calc(${100 / cols}% - 4px)`, height: cols === 1 ? 22 : 28, transitionTimingFunction: "cubic-bezier(0.2,0,0,1)" }}>
            <div className="flex h-full items-center justify-center text-[7px] text-electric/50">{i}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
