"use client";

import { useEffect, useState } from "react";

interface DemoWidget {
  id: string; x: number; y: number; w: number; h: number; color: string; label: string;
}

const BASE: DemoWidget[] = [
  { id: "a", x: 16, y: 16, w: 280, h: 140, color: "#3b9eff", label: "Revenue" },
  { id: "b", x: 310, y: 16, w: 140, h: 65, color: "#9281f7", label: "Users" },
  { id: "c", x: 460, y: 16, w: 140, h: 65, color: "#3ad389", label: "Growth" },
  { id: "d", x: 310, y: 91, w: 290, h: 65, color: "#ffca16", label: "Sales" },
  { id: "e", x: 16, y: 170, w: 140, h: 65, color: "#ff9592", label: "Orders" },
  { id: "f", x: 166, y: 170, w: 140, h: 65, color: "#70b8ff", label: "Traffic" },
];

interface Step {
  widgets: DemoWidget[];
  cursor: { x: number; y: number };
  action: string;
}

function buildSteps(): Step[] {
  const s = (ws: DemoWidget[], cx: number, cy: number, action: string): Step => ({ widgets: ws.map(w => ({ ...w })), cursor: { x: cx, y: cy }, action });
  const steps: Step[] = [];
  const ws = BASE.map(w => ({ ...w }));

  steps.push(s(ws, 100, 80, ""));
  steps.push(s(ws, 380, 48, "Dragging..."));

  const ws2 = ws.map(w => w.id === "b" ? { ...w, x: 166, y: 170 } : w.id === "f" ? { ...w, y: 245 } : w);
  steps.push(s(ws2, 236, 200, "Collision pushed Traffic down"));

  const ws3 = ws2.map(w => w.id === "a" ? { ...w, w: 430 } : w.id === "d" ? { ...w, x: 460, w: 140 } : w);
  steps.push(s(ws3, 446, 80, "Resizing from edge"));

  const ws4 = [...ws3, { id: "g", x: 310, y: 170, w: 140, h: 65, color: "#3ad389", label: "New!" }];
  steps.push(s(ws4, 380, 200, "Dropped from sidebar"));

  steps.push(s(BASE, 300, 120, ""));
  return steps;
}

export function VideoSection() {
  const [step, setStep] = useState(0);
  const steps = buildSteps();

  useEffect(() => {
    const id = setInterval(() => setStep(s => (s + 1) % steps.length), 2200);
    return () => clearInterval(id);
  }, []);

  const { widgets, cursor, action } = steps[step];

  return (
    <section className="reveal px-6 py-24" data-reveal>
      <div className="mx-auto max-w-[1200px] text-center">
        <h2 className="font-display text-4xl text-frost">See it in action</h2>
        <p className="mt-3 text-fog">Drag, resize, and reorder — all at 60fps.</p>
        <div className="mx-auto mt-12 max-w-[800px] overflow-hidden rounded-[16px] border border-rail">
          <div className="relative w-full aspect-video bg-[var(--t-code-bg)] rounded-[12px] overflow-hidden">
            {/* Fake title bar */}
            <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[#333]">
              <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-[9px] text-[#888]">GridKit Playground</span>
              <div className="ml-auto flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-[#ff5f57] animate-pulse" />
                <span className="text-[8px] text-[#888]">RECORDING</span>
              </div>
            </div>
            {/* Grid area */}
            <div className="relative mx-4 mt-3" style={{ height: 260 }}>
              {widgets.map(w => (
                <div key={w.id} className="absolute rounded-md flex flex-col justify-between p-2 transition-all duration-500" style={{
                  left: w.x, top: w.y, width: w.w, height: w.h,
                  background: `${w.color}18`,
                  border: `1px solid ${w.color}55`,
                  transitionTimingFunction: "cubic-bezier(0.2,0,0,1)",
                }}>
                  <span className="text-[7px] font-medium uppercase tracking-wider" style={{ color: w.color }}>{w.label}</span>
                  <div className="flex items-end gap-[1px]">
                    {[2, 4, 3, 5, 4, 6, 5, 7].map((h, i) => (
                      <div key={i} className="flex-1 rounded-[1px]" style={{ height: h, backgroundColor: w.color, opacity: 0.2 + i * 0.08 }} />
                    ))}
                  </div>
                </div>
              ))}
              {/* Cursor */}
              <div className="absolute z-50 transition-all duration-500" style={{ left: cursor.x, top: cursor.y, transitionTimingFunction: "cubic-bezier(0.2,0,0,1)" }}>
                <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
                  <path d="M1 1l4.5 16L7.5 11l6 1L1 1z" fill="white" stroke="#333" strokeWidth="1"/>
                </svg>
              </div>
            </div>
            {/* Action label */}
            {action && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-[#3b9eff22] border border-[#3b9eff44] px-3 py-1 text-[10px] text-[#3b9eff] animate-[fadeIn_0.3s_ease]">
                {action}
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {["Drag anywhere", "Resize from any edge", "Auto-collision", "60fps smooth"].map(t => (
            <span key={t} className="rounded-full border border-rail px-4 py-1.5 text-xs text-fog">{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
