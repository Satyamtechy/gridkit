import { Widget } from "@/types/playground";

export const CONTAINER_W = 1130;

export const WIDGET_COLORS = ["#3b9eff", "#9281f7", "#3ad389", "#ffca16", "#ff9592", "#70b8ff"];

export const INITIAL: Widget[] = [
  { id: "1", title: "Revenue Chart", color: "#3b9eff", x: 0, y: 0, w: 560, h: 280, value: "$48.2K" },
  { id: "2", title: "Active Users", color: "#9281f7", x: 570, y: 0, w: 270, h: 135, value: "2,847" },
  { id: "3", title: "Conversion", color: "#3ad389", x: 850, y: 0, w: 270, h: 135, value: "3.2%" },
  { id: "4", title: "Sales Region", color: "#ffca16", x: 570, y: 145, w: 550, h: 135, value: "NA · EU · APAC" },
  { id: "5", title: "Orders", color: "#ff9592", x: 0, y: 290, w: 270, h: 280, value: "1,204" },
  { id: "6", title: "Performance", color: "#70b8ff", x: 280, y: 290, w: 270, h: 135, value: "98.7%" },
  { id: "7", title: "Traffic", color: "#3ad389", x: 560, y: 290, w: 270, h: 135, value: "14.3K" },
  { id: "8", title: "Growth", color: "#9281f7", x: 840, y: 290, w: 270, h: 135, value: "+22%" },
];

export const TEMPLATES: Record<string, Widget[]> = {
  Dashboard: INITIAL,
  Kanban: [
    { id: "k1", title: "To Do", color: "#ff9592", x: 0, y: 0, w: 370, h: 500, value: "5 items" },
    { id: "k2", title: "In Progress", color: "#ffca16", x: 380, y: 0, w: 370, h: 500, value: "3 items" },
    { id: "k3", title: "Done", color: "#3ad389", x: 760, y: 0, w: 370, h: 500, value: "8 items" },
  ],
  Masonry: [
    { id: "m1", title: "Photo 1", color: "#3b9eff", x: 0, y: 0, w: 370, h: 250, value: "" },
    { id: "m2", title: "Photo 2", color: "#9281f7", x: 380, y: 0, w: 370, h: 180, value: "" },
    { id: "m3", title: "Photo 3", color: "#3ad389", x: 760, y: 0, w: 370, h: 320, value: "" },
    { id: "m4", title: "Photo 4", color: "#ffca16", x: 0, y: 260, w: 370, h: 180, value: "" },
    { id: "m5", title: "Photo 5", color: "#ff9592", x: 380, y: 190, w: 370, h: 250, value: "" },
    { id: "m6", title: "Photo 6", color: "#70b8ff", x: 760, y: 330, w: 370, h: 180, value: "" },
  ],
  Admin: [
    { id: "a1", title: "Sidebar", color: "#9281f7", x: 0, y: 0, w: 250, h: 560, value: "Nav" },
    { id: "a2", title: "Header", color: "#3b9eff", x: 260, y: 0, w: 870, h: 80, value: "Dashboard" },
    { id: "a3", title: "Chart", color: "#3ad389", x: 260, y: 90, w: 560, h: 280, value: "Revenue" },
    { id: "a4", title: "Stats", color: "#ffca16", x: 830, y: 90, w: 300, h: 280, value: "KPIs" },
    { id: "a5", title: "Table", color: "#70b8ff", x: 260, y: 380, w: 870, h: 180, value: "Recent orders" },
  ],
};

export function resolveCollisions(items: Widget[], movedId: string): Widget[] {
  const result = items.map(i => ({ ...i }));
  const moved = result.find(w => w.id === movedId);
  if (!moved) return result;

  for (const a of result) {
    if (a.id === movedId) continue;
    if (a.x < moved.x + moved.w && a.x + a.w > moved.x && a.y < moved.y + moved.h && a.y + a.h > moved.y) {
      a.y = moved.y + moved.h + 10;
    }
  }

  result.sort((a, b) => a.y - b.y || a.x - b.x);
  let changed = true, iter = 0;
  while (changed && iter++ < 20) {
    changed = false;
    for (let i = 0; i < result.length; i++) {
      const a = result[i];
      const end = a.y + a.h + 10;
      for (let j = i + 1; j < result.length; j++) {
        if (result[j].y >= end) break;
        const b = result[j];
        if (a.x < b.x + b.w && a.x + a.w > b.x) {
          b.y = a.y + a.h + 10;
          changed = true;
        }
      }
    }
    if (changed) result.sort((a, b) => a.y - b.y || a.x - b.x);
  }
  return result;
}

export function compactVertical(items: Widget[]): Widget[] {
  const sorted = [...items].sort((a, b) => a.y - b.y || a.x - b.x);
  for (const item of sorted) {
    let newY = 0;
    while (newY < item.y) {
      const test = { ...item, y: newY };
      const collides = sorted.some(o => o.id !== item.id && o.x < test.x + test.w && o.x + o.w > test.x && o.y < test.y + test.h && o.y + o.h > test.y);
      if (!collides) { item.y = newY; break; }
      newY += 10;
    }
  }
  return sorted;
}

export function redistributeWidgets(widgets: Widget[], newCols: number): Widget[] {
  const gap = 10;
  const newColW = Math.floor((CONTAINER_W - (newCols - 1) * gap) / newCols);
  let col = 0, rowY = 0, rowH = 0;
  return widgets.map(w => {
    const span = w.w > newColW * 1.3 ? Math.min(2, newCols) : 1;
    const itemW = span * newColW + (span - 1) * gap;
    if (col + span > newCols) { col = 0; rowY += rowH + gap; rowH = 0; }
    const x = col * (newColW + gap);
    const y = rowY;
    col += span;
    rowH = Math.max(rowH, w.h);
    return { ...w, x, y, w: itemW };
  });
}
