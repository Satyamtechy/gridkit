"use client";

import { useEffect, useState } from "react";

interface Block {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  border: string;
  title: string;
}

const INITIAL: Block[] = [
  { id: "1", x: 0, y: 0, w: 360, h: 180, color: "#3b9eff", border: "rgba(59,158,255,0.4)", title: "Revenue" },
  { id: "2", x: 370, y: 0, w: 170, h: 85, color: "#9281f7", border: "rgba(146,129,247,0.4)", title: "Users" },
  { id: "3", x: 550, y: 0, w: 170, h: 85, color: "#3ad389", border: "rgba(58,211,137,0.4)", title: "Growth" },
  { id: "4", x: 370, y: 95, w: 350, h: 85, color: "#ffca16", border: "rgba(255,202,22,0.4)", title: "Sales" },
  { id: "5", x: 0, y: 190, w: 170, h: 85, color: "#ff9592", border: "rgba(255,149,146,0.4)", title: "Orders" },
  { id: "6", x: 180, y: 190, w: 170, h: 85, color: "#70b8ff", border: "rgba(112,184,255,0.4)", title: "Traffic" },
  { id: "7", x: 360, y: 190, w: 170, h: 85, color: "#9281f7", border: "rgba(146,129,247,0.4)", title: "Perf" },
  { id: "8", x: 540, y: 190, w: 180, h: 85, color: "#3ad389", border: "rgba(58,211,137,0.4)", title: "Score" },
];

export function HeroGridAnimation() {
  const [blocks, setBlocks] = useState<Block[]>(INITIAL);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const actions = [
      () => {
        setBlocks(prev => {
          const next = prev.map(b => ({ ...b }));
          const a = next.find(b => b.id === "5")!;
          const b = next.find(b2 => b2.id === "8")!;
          const tx = a.x, ty = a.y;
          a.x = b.x; a.y = b.y;
          b.x = tx; b.y = ty;
          setActiveId("5");
          return next;
        });
      },
      () => {
        setBlocks(prev => {
          const next = prev.map(b => ({ ...b }));
          const a = next.find(b => b.id === "2")!;
          const b = next.find(b2 => b2.id === "3")!;
          const tx = a.x, ty = a.y;
          a.x = b.x; a.y = b.y;
          b.x = tx; b.y = ty;
          setActiveId("2");
          return next;
        });
      },
      () => {
        setBlocks(prev => prev.map(b => b.id === "6" ? { ...b, w: 350 } : b.id === "7" ? { ...b, x: 540, w: 180 } : b));
        setActiveId("6");
      },
      () => {
        setBlocks(prev => prev.map(b => b.id === "6" ? { ...b, w: 170 } : b.id === "7" ? { ...b, x: 360, w: 170 } : b));
        setActiveId("7");
      },
      () => {
        setBlocks(prev => prev.map(b => b.id === "1" ? { ...b, x: 370, w: 350 } : b.id === "4" ? { ...b, x: 0, w: 360 } : b));
        setActiveId("1");
      },
      () => { setBlocks(INITIAL); setActiveId(null); },
    ];

    let step = 0;
    const interval = setInterval(() => {
      actions[step]();
      setTimeout(() => setActiveId(null), 500);
      step = (step + 1) % actions.length;
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full" style={{ height: 280 }}>
      {blocks.map(block => (
        <div
          key={block.id}
          className="absolute rounded-[10px] flex flex-col justify-between p-3"
          style={{
            left: block.x,
            top: block.y,
            width: block.w,
            height: block.h,
            background: `${block.color}14`,
            border: `1px solid ${block.border}`,
            transition: "left 0.5s cubic-bezier(0.2,0,0,1), top 0.5s cubic-bezier(0.2,0,0,1), width 0.5s cubic-bezier(0.2,0,0,1), height 0.5s cubic-bezier(0.2,0,0,1), transform 0.3s ease, box-shadow 0.3s ease",
            transform: activeId === block.id ? "scale(1.03)" : "scale(1)",
            zIndex: activeId === block.id ? 10 : 1,
            boxShadow: activeId === block.id ? `0 0 25px ${block.color}33` : "none",
          }}
        >
          <span className="text-[9px] font-medium uppercase tracking-wider" style={{ color: block.color }}>{block.title}</span>
          <div className="flex items-end gap-[2px]">
            {[3,5,4,7,5,8,6,9].map((h, i) => (
              <div key={i} className="flex-1 rounded-[2px]" style={{ height: h + 2, backgroundColor: block.color, opacity: 0.15 + (i / 8) * 0.4 }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
