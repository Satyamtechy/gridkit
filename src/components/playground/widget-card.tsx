import React from "react";
import { Widget, Features } from "@/types/playground";

interface Props {
  widget: Widget;
  isActive: boolean;
  isFocused: boolean;
  features: Features;
  handleDragStart: (e: React.PointerEvent, id: string) => void;
  handleResizeStart: (e: React.PointerEvent, id: string, dir: string) => void;
}

export function WidgetCard({ widget, isActive, isFocused, features, handleDragStart, handleResizeStart }: Props) {
  const isLocked = features.lock && widget.id === "1";

  return (
    <div
      data-wid={widget.id}
      className={`group absolute overflow-hidden rounded-[12px] border bg-surface select-none ${isActive ? "z-50 border-electric shadow-[0_0_20px_rgba(59,158,255,0.15)]" : isFocused ? "z-40 border-electric ring-2 ring-electric/40" : "border-rail hover:border-smoke"} ${isActive || !features.animate ? "" : "transition-[left,top,width,height,box-shadow,border-color] duration-300"} ${isLocked ? "ring-2 ring-warning/30" : ""}`}
      style={{ left: widget.x, top: widget.y, width: widget.w, height: widget.h }}
    >
      {features.drag && !isLocked && (
        <div className="absolute inset-[6px] z-10 cursor-grab active:cursor-grabbing" onPointerDown={e => handleDragStart(e, widget.id)} />
      )}

      <div className="pointer-events-none flex h-full flex-col p-4">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: widget.color }} />
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-fog">{widget.title}</p>
          {isLocked && <span className="ml-auto text-[8px] text-warning"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></span>}
        </div>
        <p className="mt-auto text-[26px] font-semibold leading-none tracking-tight text-frost">{widget.value}</p>
        <div className="mt-2 flex items-end gap-[2px]">
          {[3, 7, 5, 9, 4, 8, 6, 10, 5, 7].map((h, i) => (
            <div key={i} className="flex-1 rounded-[2px]" style={{ height: `${h + parseInt(widget.id)}px`, backgroundColor: widget.color, opacity: 0.15 + (i / 10) * 0.5 }} />
          ))}
        </div>
        <p className="mt-1 font-mono text-[9px] text-ash">{Math.round(widget.w)}×{Math.round(widget.h)}</p>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] rounded-t-[12px] opacity-40" style={{ background: `linear-gradient(90deg, transparent, ${widget.color}, transparent)` }} />

      {features.resize && !isLocked && <>
        {/* Edge handles — sleek pill bars */}
        <div className="absolute inset-y-0 right-0 w-[8px] cursor-ew-resize z-20 flex items-center justify-center" onPointerDown={e => handleResizeStart(e, widget.id, "e")}><div className="h-8 w-[3px] rounded-full bg-electric/50 opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_4px_rgba(59,158,255,0.3)]" /></div>
        <div className="absolute inset-y-0 left-0 w-[8px] cursor-ew-resize z-20 flex items-center justify-center" onPointerDown={e => handleResizeStart(e, widget.id, "w")}><div className="h-8 w-[3px] rounded-full bg-electric/50 opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_4px_rgba(59,158,255,0.3)]" /></div>
        <div className="absolute inset-x-0 bottom-0 h-[8px] cursor-ns-resize z-20 flex items-center justify-center" onPointerDown={e => handleResizeStart(e, widget.id, "s")}><div className="w-8 h-[3px] rounded-full bg-electric/50 opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_4px_rgba(59,158,255,0.3)]" /></div>
        <div className="absolute inset-x-0 top-0 h-[8px] cursor-ns-resize z-20 flex items-center justify-center" onPointerDown={e => handleResizeStart(e, widget.id, "n")}><div className="w-8 h-[3px] rounded-full bg-electric/50 opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_4px_rgba(59,158,255,0.3)]" /></div>
        {/* Corner handles — 90° curved lines matching edge bars */}
        <div className="absolute bottom-0 right-0 h-5 w-5 cursor-nwse-resize z-30 opacity-0 group-hover:opacity-100 transition-opacity" onPointerDown={e => handleResizeStart(e, widget.id, "se")}>
          <svg className="absolute bottom-[2px] right-[2px]" width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M10 1a9 9 0 0 1-9 9" stroke="var(--color-electric)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/></svg>
        </div>
        <div className="absolute bottom-0 left-0 h-5 w-5 cursor-nesw-resize z-30 opacity-0 group-hover:opacity-100 transition-opacity" onPointerDown={e => handleResizeStart(e, widget.id, "sw")}>
          <svg className="absolute bottom-[2px] left-[2px]" width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M0 1a9 9 0 0 0 9 9" stroke="var(--color-electric)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/></svg>
        </div>
        <div className="absolute top-0 right-0 h-5 w-5 cursor-nesw-resize z-30 opacity-0 group-hover:opacity-100 transition-opacity" onPointerDown={e => handleResizeStart(e, widget.id, "ne")}>
          <svg className="absolute top-[2px] right-[2px]" width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M10 9a9 9 0 0 0-9-9" stroke="var(--color-electric)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/></svg>
        </div>
        <div className="absolute top-0 left-0 h-5 w-5 cursor-nwse-resize z-30 opacity-0 group-hover:opacity-100 transition-opacity" onPointerDown={e => handleResizeStart(e, widget.id, "nw")}>
          <svg className="absolute top-[2px] left-[2px]" width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M0 9a9 9 0 0 1 9-9" stroke="var(--color-electric)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/></svg>
        </div>
      </>}
    </div>
  );
}
