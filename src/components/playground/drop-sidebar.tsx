import React from "react";
import { Widget, Features, GridAction } from "@/types/playground";
import { CONTAINER_W, resolveCollisions } from "@/lib/grid-utils";

interface Props {
  features: Features;
  dispatch: React.Dispatch<GridAction>;
}

const DROP_ITEMS = [
  { color: "#3b9eff", label: "Chart" },
  { color: "#9281f7", label: "Table" },
  { color: "#3ad389", label: "KPI" },
] as const;

export function DropSidebar({ features, dispatch }: Props) {
  const handleDragEnd = (e: React.DragEvent, item: { color: string; label: string }) => {
    const gridEl = document.querySelector("[data-grid-container]");
    if (!gridEl) return;
    const rect = gridEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x < 0 || y < 0 || x > CONTAINER_W) return;
    dispatch({ type: "ADD", widget: { id: String(Date.now()), title: item.label, color: item.color, x, y, w: 270, h: 135, value: "—" } });
  };

  return (
    <aside className="w-20 shrink-0 space-y-2 rounded-xl border border-dashed border-rail p-2">
      <p className="text-center text-[8px] text-ash">Drag into grid</p>
      {DROP_ITEMS.map(item => (
        <div key={item.label} draggable onDragEnd={(e) => handleDragEnd(e, item)}
          className="flex cursor-grab flex-col items-center gap-1 rounded-lg border border-rail bg-surface p-2 active:cursor-grabbing hover:border-smoke">
          <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: item.color, opacity: 0.6 }} />
          <span className="text-[8px] text-fog">{item.label}</span>
        </div>
      ))}
    </aside>
  );
}
