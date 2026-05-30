"use client";

import { useEffect, useState } from "react";

export function ResizeDemo() {
  const [size, setSize] = useState({ w: 80, h: 50 });
  useEffect(() => {
    const frames = [{ w: 80, h: 50 }, { w: 140, h: 50 }, { w: 140, h: 75 }, { w: 60, h: 75 }, { w: 80, h: 50 }];
    let i = 0;
    const id = setInterval(() => { i = (i + 1) % frames.length; setSize(frames[i]); }, 1100);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="relative h-[100px] w-full overflow-hidden rounded-lg border border-rail bg-surface">
      <div className="absolute left-3 top-3 rounded-md border border-violet/40 bg-violet/10 transition-all duration-600" style={{ width: size.w, height: size.h, transitionTimingFunction: "cubic-bezier(0.2,0,0,1)" }}>
        {/* Edge handles — pill bars */}
        <div className="absolute -right-[2px] top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-violet/60" />
        <div className="absolute -bottom-[2px] left-1/2 h-[3px] w-5 -translate-x-1/2 rounded-full bg-violet/60" />
        <div className="absolute -left-[2px] top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-violet/60" />
        <div className="absolute -top-[2px] left-1/2 h-[3px] w-5 -translate-x-1/2 rounded-full bg-violet/60" />
        {/* Corner handles — 90° curves */}
        <svg className="absolute -bottom-[2px] -right-[2px]" width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M10 1a9 9 0 0 1-9 9" stroke="var(--color-violet)" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/></svg>
        <svg className="absolute -bottom-[2px] -left-[2px]" width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M0 1a9 9 0 0 0 9 9" stroke="var(--color-violet)" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/></svg>
        <svg className="absolute -top-[2px] -right-[2px]" width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M10 9a9 9 0 0 0-9-9" stroke="var(--color-violet)" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/></svg>
        <svg className="absolute -top-[2px] -left-[2px]" width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M0 9a9 9 0 0 1 9-9" stroke="var(--color-violet)" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/></svg>
        <div className="p-2 text-[8px] text-violet/60">{size.w}×{size.h}</div>
      </div>
    </div>
  );
}
