"use client";

import { useEffect, useState } from "react";

export function NestedDemo() {
  const [innerPos, setInnerPos] = useState(4);
  useEffect(() => {
    const id = setInterval(() => setInnerPos(p => p === 4 ? 28 : 4), 1500);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="relative h-[100px] w-full overflow-hidden rounded-lg border border-rail bg-surface p-2">
      <div className="absolute left-3 top-3 h-[80px] w-[120px] rounded-md border border-violet/30 bg-violet/5 p-1">
        <div className="text-[6px] text-violet/50 mb-0.5">Parent</div>
        <div className="relative h-[50px] rounded border border-dashed border-violet/20">
          <div className="absolute left-1 h-5 w-8 rounded-sm border border-success/40 bg-success/10 transition-all duration-500" style={{ top: innerPos, transitionTimingFunction: "cubic-bezier(0.2,0,0,1)" }}>
            <div className="flex h-full items-center justify-center text-[6px] text-success/60">c</div>
          </div>
          <div className="absolute right-1 top-1 h-5 w-8 rounded-sm border border-info/40 bg-info/10">
            <div className="flex h-full items-center justify-center text-[6px] text-info/60">c</div>
          </div>
        </div>
      </div>
      <div className="absolute right-3 top-3 h-[80px] w-[60px] rounded-md border border-electric/30 bg-electric/5">
        <div className="p-1 text-[6px] text-electric/50">Parent 2</div>
      </div>
    </div>
  );
}
