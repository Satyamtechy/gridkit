import {
  resolveCollisions,
  verticalCompactor
} from "./chunk-P3ZWYT3B.mjs";

// src/headless.ts
function computeLayout(items, options) {
  const { containerWidth, gap = 10, columns, rowHeight, bounds = true, collision = true } = options;
  const comp = options.compactor ?? verticalCompactor;
  let resolved = items.map((i) => ({ ...i }));
  if (columns && rowHeight) {
    const colW = (containerWidth - (columns - 1) * gap) / columns;
    resolved = resolved.map((item) => ({
      ...item,
      x: item.x * (colW + gap),
      y: item.y * (rowHeight + gap),
      w: item.w * colW + (item.w - 1) * gap,
      h: item.h * rowHeight + (item.h - 1) * gap
    }));
  }
  const cols = columns ?? Math.floor((containerWidth + gap) / (100 + gap));
  resolved = comp.compact(resolved, cols, gap);
  if (collision && resolved.length > 1) {
    for (const item of resolved) {
      resolved = resolveCollisions(resolved, item.id, gap);
    }
  }
  if (bounds) {
    resolved = resolved.map((item) => ({
      ...item,
      x: Math.max(0, Math.min(item.x, containerWidth - item.w)),
      y: Math.max(0, item.y)
    }));
  }
  return resolved;
}
function computeGridLayout(items, options) {
  const { columns, gap = 0 } = options;
  const comp = options.compactor ?? verticalCompactor;
  return comp.compact(items.map((i) => ({ ...i })), columns, gap);
}

export {
  computeLayout,
  computeGridLayout
};
