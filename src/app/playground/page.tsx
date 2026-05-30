"use client";

import React, { useRef, useCallback, useEffect, useState } from "react";
import { useGridState } from "@/lib/use-grid-state";
import { CONTAINER_W, resolveCollisions, TEMPLATES } from "@/lib/grid-utils";
import { Features, Widget } from "@/types/playground";
import { PlaygroundToolbar } from "@/components/playground/playground-toolbar";
import { FeatureChips } from "@/components/playground/feature-chips";
import { TemplateSelector } from "@/components/playground/template-selector";
import { WidgetCard } from "@/components/playground/widget-card";
import { KeyboardLegend } from "@/components/playground/keyboard-legend";
import { DropSidebar } from "@/components/playground/drop-sidebar";
import { LiveSizeBadge } from "@/components/playground/live-size-badge";

export default function PlaygroundPage() {
  const { state, dispatch, handleSetCols } = useGridState();
  const [activeTemplate, setActiveTemplate] = useState("Dashboard");
  const { widgets, activeId, focusedId, liveSize, features, cols } = state;
  const dragRef = useRef({ mx: 0, my: 0, ox: 0, oy: 0, ow: 0, oh: 0, dir: "", _finalX: 0, _finalY: 0, _final: { x: 0, y: 0, w: 0, h: 0 } });
  const widgetsRef = useRef(widgets);
  widgetsRef.current = widgets;
  const featuresRef = useRef(features);
  featuresRef.current = features;
  const focusedRef = useRef(focusedId);
  focusedRef.current = focusedId;

  // Keyboard navigation & undo/redo
  useEffect(() => {
    if (!features.keyboard && !features.undoRedo) return;
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && features.undoRedo) {
        e.preventDefault();
        dispatch({ type: e.shiftKey ? "REDO" : "UNDO" });
        return;
      }
      if (!features.keyboard) return;
      if (e.key === "Tab") {
        e.preventDefault();
        const ids = widgetsRef.current.map(w => w.id);
        const idx = ids.indexOf(focusedRef.current ?? "");
        dispatch({ type: "SET_FOCUSED", id: ids[(idx + (e.shiftKey ? -1 : 1) + ids.length) % ids.length] });
        return;
      }
      const fid = focusedRef.current;
      if (!fid) return;
      const w = widgetsRef.current.find(v => v.id === fid);
      if (!w) return;
      const step = 10;
      let partial: Partial<Widget> | null = null;
      switch (e.key) {
        case "ArrowLeft": partial = e.shiftKey ? { w: Math.max(120, w.w - step) } : { x: w.x - step }; break;
        case "ArrowRight": partial = e.shiftKey ? { w: w.w + step } : { x: w.x + step }; break;
        case "ArrowUp": partial = e.shiftKey ? { h: Math.max(80, w.h - step) } : { y: w.y - step }; break;
        case "ArrowDown": partial = e.shiftKey ? { h: w.h + step } : { y: w.y + step }; break;
        case "Escape": dispatch({ type: "SET_FOCUSED", id: null }); return;
      }
      if (partial) {
        e.preventDefault();
        const merged = { ...w, ...partial };
        if (partial.w !== undefined || partial.h !== undefined) {
          dispatch({ type: "RESIZE", id: fid, x: merged.x, y: merged.y, w: merged.w, h: merged.h });
        } else {
          dispatch({ type: "MOVE", id: fid, x: merged.x, y: merged.y });
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [features.keyboard, features.undoRedo, dispatch]);

  // Responsive observer
  useEffect(() => {
    if (!features.responsive) return;
    const el = document.querySelector("[data-grid-container]");
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width;
      let newCols = w < 500 ? 2 : w < 700 ? 3 : w < 1000 ? 4 : 5;
      if (newCols !== cols) handleSetCols(newCols);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [features.responsive, cols, handleSetCols]);

  const handleDragStart = useCallback((e: React.PointerEvent, id: string) => {
    const f = featuresRef.current;
    if (!f.drag) return;
    e.preventDefault();
    const w = widgetsRef.current.find(v => v.id === id)!;
    if (f.lock && w.id === "1") return;
    dragRef.current = { mx: e.clientX, my: e.clientY, ox: w.x, oy: w.y, ow: w.w, oh: w.h, dir: "move", _finalX: w.x, _finalY: w.y, _final: { x: w.x, y: w.y, w: w.w, h: w.h } };
    dispatch({ type: "SET_ACTIVE", id });
    const el = (e.currentTarget as HTMLElement).closest("[data-wid]") as HTMLElement;
    if (el) el.style.willChange = "left, top";
    let rafId = 0;
    const onMove = (ev: PointerEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const r = dragRef.current;
        const f2 = featuresRef.current;
        let nx = r.ox + (ev.clientX - r.mx), ny = r.oy + (ev.clientY - r.my);
        if (f2.bounds) { nx = Math.max(0, Math.min(nx, CONTAINER_W - r.ow)); ny = Math.max(0, ny); }
        if (f2.snap) { nx = Math.round(nx / 10) * 10; ny = Math.round(ny / 10) * 10; }
        if (el) { el.style.left = `${nx}px`; el.style.top = `${ny}px`; el.style.transition = "none"; }
        r._finalX = nx; r._finalY = ny;
        dispatch({ type: "SET_LIVE_SIZE", size: { x: nx, y: ny, w: r.ow, h: r.oh } });
      });
    };
    const onUp = () => {
      cancelAnimationFrame(rafId);
      if (el) { el.style.transition = ""; el.style.willChange = ""; }
      dispatch({ type: "MOVE", id, x: dragRef.current._finalX, y: dragRef.current._finalY });
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, [dispatch]);

  const handleResizeStart = useCallback((e: React.PointerEvent, id: string, dir: string) => {
    const f = featuresRef.current;
    if (!f.resize) return;
    e.preventDefault(); e.stopPropagation();
    const w = widgetsRef.current.find(v => v.id === id)!;
    dragRef.current = { mx: e.clientX, my: e.clientY, ox: w.x, oy: w.y, ow: w.w, oh: w.h, dir, _finalX: w.x, _finalY: w.y, _final: { x: w.x, y: w.y, w: w.w, h: w.h } };
    dispatch({ type: "SET_ACTIVE", id });
    const el = (e.currentTarget as HTMLElement).closest("[data-wid]") as HTMLElement;
    if (el) el.style.willChange = "left, top, width, height";
    let rafId = 0;
    const onMove = (ev: PointerEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const r = dragRef.current;
        const f2 = featuresRef.current;
        const dx = ev.clientX - r.mx, dy = ev.clientY - r.my;
        let x = r.ox, y = r.oy, w2 = r.ow, h = r.oh;
        if (r.dir.includes("e")) w2 = Math.max(120, r.ow + dx);
        if (r.dir.includes("w")) { w2 = Math.max(120, r.ow - dx); x = r.ox + (r.ow - w2); }
        if (r.dir.includes("s")) h = Math.max(80, r.oh + dy);
        if (r.dir.includes("n")) { h = Math.max(80, r.oh - dy); y = r.oy + (r.oh - h); }
        if (f2.bounds) { if (x < 0) { w2 += x; x = 0; } if (x + w2 > CONTAINER_W) w2 = CONTAINER_W - x; if (y < 0) { h += y; y = 0; } }
        if (w2 < 120) w2 = 120; if (h < 80) h = 80;
        if (el) { el.style.left = `${x}px`; el.style.top = `${y}px`; el.style.width = `${w2}px`; el.style.height = `${h}px`; el.style.transition = "none"; }
        r._final = { x, y, w: w2, h };
        dispatch({ type: "SET_LIVE_SIZE", size: { x, y, w: w2, h } });
      });
    };
    const onUp = () => {
      cancelAnimationFrame(rafId);
      if (el) { el.style.transition = ""; el.style.willChange = ""; }
      const f2 = dragRef.current._final;
      dispatch({ type: "RESIZE", id, x: f2.x, y: f2.y, w: f2.w, h: f2.h });
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, [dispatch]);

  const containerH = Math.max(700, ...widgets.map(w => w.y + w.h + 50));

  return (
    <div className="min-h-screen bg-void">
      <div className="sticky top-[49px] z-50 border-b border-rail bg-void/95 backdrop-blur-lg">
        <PlaygroundToolbar state={state} dispatch={dispatch} handleSetCols={handleSetCols} />
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-2 px-6 pb-2.5">
          <FeatureChips features={features} dispatch={dispatch} />
          <div className="h-4 w-px bg-rail ml-2" />
          <TemplateSelector activeTemplate={activeTemplate} onSelect={(name) => { setActiveTemplate(name); dispatch({ type: "SET_ALL", widgets: TEMPLATES[name] }); }} />
        </div>
      </div>
      <div className="mx-auto max-w-[1400px] px-6 py-6">
        <div className="flex gap-4">
          {features.dropZone && <DropSidebar features={features} dispatch={dispatch} />}
          <div data-grid-container className="relative flex-1 overflow-hidden" style={{ height: containerH, maxWidth: CONTAINER_W }}>
            {widgets.map(widget => (
              <WidgetCard key={widget.id} widget={widget} isActive={activeId === widget.id} isFocused={focusedId === widget.id} features={features} handleDragStart={handleDragStart} handleResizeStart={handleResizeStart} />
            ))}
            {liveSize && activeId && <LiveSizeBadge liveSize={liveSize} />}
          </div>
          {features.keyboard && <KeyboardLegend showUndo={features.undoRedo} />}
        </div>
      </div>
    </div>
  );
}
