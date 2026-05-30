import React, { useState } from "react";
import { GridState, GridAction } from "@/types/playground";
import { INITIAL, WIDGET_COLORS, CONTAINER_W } from "@/lib/grid-utils";

interface Props {
  state: GridState;
  dispatch: React.Dispatch<GridAction>;
  handleSetCols: (cols: number) => void;
}

export function PlaygroundToolbar({ state, dispatch, handleSetCols }: Props) {
  const [copied, setCopied] = useState(false);
  const { widgets, cols, features, historyIdx } = state;

  const handleAdd = () => {
    const maxY = Math.max(...widgets.map(w => w.y + w.h), 0);
    dispatch({
      type: "ADD",
      widget: { id: String(Date.now()), title: `Widget ${widgets.length + 1}`, color: WIDGET_COLORS[widgets.length % WIDGET_COLORS.length], x: 0, y: maxY + 20, w: 270, h: 160, value: "—" },
    });
  };

  const handleReset = () => dispatch({ type: "SET_ALL", widgets: INITIAL });

  const handleExport = () => {
    navigator.clipboard.writeText(JSON.stringify(widgets.map(w => ({ id: w.id, x: w.x, y: w.y, w: w.w, h: w.h, title: w.title })), null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-3 px-6 py-2.5">
      <div className="flex items-center gap-1.5 text-xs text-fog">
        Columns:
        {[3, 4, 5, 6].map(n => (
          <button key={n} onClick={() => handleSetCols(n)}
            className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-all ${cols === n ? "bg-electric/15 text-electric ring-1 ring-electric/30" : "text-fog hover:text-frost"}`}>
            {n}
          </button>
        ))}
      </div>
      <div className="h-4 w-px bg-rail" />
      <button onClick={handleAdd} className="cursor-pointer rounded-full border border-electric/30 px-3.5 py-1.5 text-xs text-frost transition-all hover:border-electric hover:bg-electric/5">+ Add</button>
      <button onClick={handleReset} className="cursor-pointer rounded-full border border-rail px-3.5 py-1.5 text-xs text-fog transition-all hover:text-frost">Reset</button>
      <button onClick={handleExport}
        className="cursor-pointer rounded-full border border-rail px-3.5 py-1.5 text-xs text-fog transition-all hover:text-frost flex items-center gap-1.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        {copied ? "Copied!" : "Export JSON"}
      </button>
      {features.undoRedo && <>
        <div className="h-4 w-px bg-rail" />
        <button onClick={() => dispatch({ type: "UNDO" })} disabled={historyIdx <= 0} className="cursor-pointer rounded-full border border-rail px-2.5 py-1.5 text-xs text-fog transition-all hover:text-frost disabled:opacity-30 disabled:cursor-not-allowed" title="Undo (Ctrl+Z)">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 7v6h6"/><path d="M3 13a9 9 0 0 1 15.36-6.36"/></svg>
        </button>
        <button onClick={() => dispatch({ type: "REDO" })} disabled={historyIdx >= state.history.length - 1} className="cursor-pointer rounded-full border border-rail px-2.5 py-1.5 text-xs text-fog transition-all hover:text-frost disabled:opacity-30 disabled:cursor-not-allowed" title="Redo (Ctrl+Shift+Z)">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 7v6h-6"/><path d="M21 13a9 9 0 0 0-15.36-6.36"/></svg>
        </button>
      </>}
      <span className="ml-auto font-mono text-[10px] text-ash">{widgets.length} widgets · {cols} cols</span>
    </div>
  );
}
