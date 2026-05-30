"use client";

import { useEffect, useState } from "react";

export function UndoDemo() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep(s => (s + 1) % 6), 1000);
    return () => clearInterval(id);
  }, []);
  const positions = [
    { x: 8, label: "" }, { x: 40, label: "move" }, { x: 80, label: "move" },
    { x: 40, label: "undo ↩" }, { x: 8, label: "undo ↩" }, { x: 40, label: "redo ↪" },
  ];
  return (
    <div className="relative h-[100px] w-full overflow-hidden rounded-lg border border-rail bg-surface">
      <div className="absolute rounded-md border border-info/40 bg-info/10 transition-all duration-400" style={{ left: positions[step].x, top: 30, width: 40, height: 35, transitionTimingFunction: "cubic-bezier(0.2,0,0,1)" }}>
        <div className="flex h-full items-center justify-center text-[8px] text-info/60">W</div>
      </div>
      {positions[step].label && <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-rail px-2 py-0.5 text-[8px] text-fog">{positions[step].label}</div>}
      <div className="absolute right-2 top-2 flex gap-0.5">
        {[0, 1, 2, 3, 4, 5].map(i => <div key={i} className={`h-1.5 w-1.5 rounded-full transition-colors ${i <= step ? "bg-info/60" : "bg-rail"}`} />)}
      </div>
    </div>
  );
}
