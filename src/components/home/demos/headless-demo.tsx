"use client";

import { useEffect, useState } from "react";

export function HeadlessDemo() {
  const [mode, setMode] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setMode(m => (m + 1) % 3), 2000);
    return () => clearInterval(id);
  }, []);
  const labels = ["Server", "Hydrate", "Interactive"];
  const colors = ["text-warning", "text-violet", "text-success"];
  return (
    <div className="relative h-[100px] w-full overflow-hidden rounded-lg border border-rail bg-surface p-2">
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-center gap-2">
          {labels.map((l, i) => (
            <div key={l} className={`rounded px-1.5 py-0.5 text-[7px] transition-all duration-300 ${i === mode ? `border border-current ${colors[i]} bg-current/10` : "text-fog/30 border border-transparent"}`}>{l}</div>
          ))}
        </div>
        <div className="relative h-[50px]">
          <div className={`absolute left-0 top-0 h-5 w-12 rounded-sm border transition-all duration-500 ${mode >= 0 ? "border-frost/20 bg-frost/5 opacity-100" : "opacity-0"}`} />
          <div className={`absolute left-14 top-0 h-5 w-8 rounded-sm border transition-all duration-500 delay-100 ${mode >= 0 ? "border-frost/20 bg-frost/5 opacity-100" : "opacity-0"}`} />
          <div className={`absolute left-0 top-7 h-5 w-20 rounded-sm border transition-all duration-500 delay-200 ${mode >= 1 ? "border-violet/30 bg-violet/8 opacity-100" : "border-frost/20 bg-frost/5 opacity-100"}`} />
          {mode >= 2 && <div className="absolute right-0 top-0 text-[7px] text-success animate-[fadeIn_0.3s_ease]">✓ Hydrated</div>}
        </div>
      </div>
    </div>
  );
}
