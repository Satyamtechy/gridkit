"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/headless.ts
var headless_exports = {};
__export(headless_exports, {
  computeGridLayout: () => computeGridLayout,
  computeLayout: () => computeLayout
});
module.exports = __toCommonJS(headless_exports);

// src/collision.ts
function overlaps(a, b, gap = 0) {
  return a.x < b.x + b.w + gap && a.x + a.w + gap > b.x && a.y < b.y + b.h + gap && a.y + a.h + gap > b.y;
}
function resolveCollisions(items, movedId, gap = 0) {
  const result = items.map((i) => ({ ...i }));
  const moved = result.find((i) => i.id === movedId);
  if (!moved) return result;
  for (const item of result) {
    if (item.id === movedId || item.locked) continue;
    if (overlaps(moved, item, gap)) {
      item.y = moved.y + moved.h + gap;
    }
  }
  result.sort((a, b) => a.y - b.y || a.x - b.x);
  let changed = true;
  let iterations = 0;
  while (changed && iterations < 50) {
    changed = false;
    iterations++;
    for (let i = 0; i < result.length; i++) {
      const item = result[i];
      if (item.locked) continue;
      const searchEnd = item.y + item.h + gap;
      for (let j = i + 1; j < result.length; j++) {
        if (result[j].y >= searchEnd) break;
        if (result[j].locked) continue;
        if (overlaps(item, result[j], gap)) {
          result[j].y = item.y + item.h + gap;
          changed = true;
        }
      }
    }
    if (changed) result.sort((a, b) => a.y - b.y || a.x - b.x);
  }
  return result;
}

// src/compaction.ts
var verticalCompactor = {
  compact(items, _cols, gap) {
    const sorted = [...items].map((i) => ({ ...i })).sort((a, b) => a.y - b.y || a.x - b.x);
    for (const item of sorted) {
      if (item.locked) continue;
      let newY = 0;
      while (newY < item.y) {
        const test = { ...item, y: newY };
        if (!sorted.some((o) => o.id !== item.id && overlaps(test, o, gap))) {
          item.y = newY;
          break;
        }
        newY++;
      }
    }
    return sorted;
  }
};

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  computeGridLayout,
  computeLayout
});
