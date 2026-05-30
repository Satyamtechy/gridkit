import React from "react";
import { LiveSize } from "@/types/playground";

interface Props {
  liveSize: LiveSize;
}

export function LiveSizeBadge({ liveSize }: Props) {
  return (
    <div className="absolute z-[60] pointer-events-none rounded-full bg-surface border border-rail px-2 py-0.5 text-[10px] font-mono text-frost shadow-lg"
      style={{ left: liveSize.x + liveSize.w + 4, top: liveSize.y }}>
      {Math.round(liveSize.w)}&times;{Math.round(liveSize.h)}
    </div>
  );
}
