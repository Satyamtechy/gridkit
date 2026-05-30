import { GridKitItem, Compactor } from "./types";
import { overlaps } from "./collision";

/** Vertical compaction — move items up to fill gaps */
export const verticalCompactor: Compactor = {
  compact(items: GridKitItem[], _cols: number, gap: number): GridKitItem[] {
    const sorted = [...items].map(i => ({ ...i })).sort((a, b) => a.y - b.y || a.x - b.x);
    for (const item of sorted) {
      if (item.locked) continue;
      let newY = 0;
      while (newY < item.y) {
        const test = { ...item, y: newY };
        if (!sorted.some(o => o.id !== item.id && overlaps(test, o, gap))) {
          item.y = newY;
          break;
        }
        newY++;
      }
    }
    return sorted;
  },
};

/** Horizontal compaction — move items left to fill gaps */
export const horizontalCompactor: Compactor = {
  compact(items: GridKitItem[], _cols: number, gap: number): GridKitItem[] {
    const sorted = [...items].map(i => ({ ...i })).sort((a, b) => a.x - b.x || a.y - b.y);
    for (const item of sorted) {
      if (item.locked) continue;
      let newX = 0;
      while (newX < item.x) {
        const test = { ...item, x: newX };
        if (!sorted.some(o => o.id !== item.id && overlaps(test, o, gap))) {
          item.x = newX;
          break;
        }
        newX++;
      }
    }
    return sorted;
  },
};

/** No compaction — leave items where they are */
export const noCompactor: Compactor = {
  compact(items: GridKitItem[]): GridKitItem[] {
    return items.map(i => ({ ...i }));
  },
};
