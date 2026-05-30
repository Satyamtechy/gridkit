"use client";

import { useEffect, useState } from "react";

export function DropzoneDemo() {
  const [dropping, setDropping] = useState(false);
  const [dropped, setDropped] = useState(false);
  useEffect(() => {
    const id = setInterval(() => {
      setDropping(true); setDropped(false);
      setTimeout(() => { setDropping(false); setDropped(true); }, 800);
      setTimeout(() => setDropped(false), 2200);
    }, 2800);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="relative h-[100px] w-full overflow-hidden rounded-lg border border-rail bg-surface">
      {/* Sidebar */}
      <div className="absolute left-0 top-0 h-full w-10 border-r border-rail bg-surface/50">
        <div className="mt-2 flex flex-col items-center gap-1.5">
          <div className={`h-3.5 w-6 rounded-sm border border-warning/40 bg-warning/10 transition-all duration-500 ${dropping ? "opacity-30 scale-75" : ""}`} />
          <div className="h-3.5 w-6 rounded-sm border border-violet/30 bg-violet/8" />
        </div>
      </div>
      {/* Grid area */}
      <div className="absolute left-12 top-2 right-2 bottom-2 rounded border border-dashed border-rail/50">
        {dropped && <div className="absolute left-2 top-2 h-10 w-16 animate-[scaleIn_0.3s_ease_both] rounded border border-warning/40 bg-warning/10"><div className="flex h-full items-center justify-center text-[7px] text-warning/60">New!</div></div>}
        {dropping && <div className="absolute left-2 top-2 h-10 w-16 rounded border-2 border-dashed border-electric/50 bg-electric/5"><div className="flex h-full items-center justify-center text-[7px] text-electric/50">Drop here</div></div>}
        <div className="absolute right-2 top-2 h-8 w-12 rounded border border-success/30 bg-success/8" />
        <div className="absolute right-2 bottom-2 h-8 w-16 rounded border border-violet/30 bg-violet/8" />
      </div>
    </div>
  );
}
