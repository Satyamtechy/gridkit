import React from "react";

interface Props {
  showUndo: boolean;
}

export function KeyboardLegend({ showUndo }: Props) {
  return (
    <aside className="hidden w-44 shrink-0 lg:block">
      <div className="sticky top-28 rounded-lg border border-electric/30 bg-surface p-3">
        <p className="text-[10px] font-semibold text-electric mb-2 flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h8M6 16h.01M18 16h.01"/></svg>
          Keyboard
        </p>
        <div className="space-y-1.5 text-[9px]">
          <div className="flex items-center gap-2"><kbd className="rounded border border-rail bg-void px-1.5 py-0.5 font-mono text-frost">Tab</kbd><span className="text-fog">Focus next</span></div>
          <div className="flex items-center gap-2"><kbd className="rounded border border-rail bg-void px-1.5 py-0.5 font-mono text-frost">↑↓←→</kbd><span className="text-fog">Move</span></div>
          <div className="flex items-center gap-2"><kbd className="rounded border border-rail bg-void px-1.5 py-0.5 font-mono text-frost">Shift+↑↓←→</kbd><span className="text-fog">Resize</span></div>
          <div className="flex items-center gap-2"><kbd className="rounded border border-rail bg-void px-1.5 py-0.5 font-mono text-frost">Esc</kbd><span className="text-fog">Deselect</span></div>
          {showUndo && <div className="flex items-center gap-2"><kbd className="rounded border border-rail bg-void px-1.5 py-0.5 font-mono text-frost">Ctrl+Z</kbd><span className="text-fog">Undo</span></div>}
        </div>
      </div>
    </aside>
  );
}
