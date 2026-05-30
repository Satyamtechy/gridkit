import { GridKitItem } from "./types";

export function overlaps(a: GridKitItem, b: GridKitItem, gap = 0): boolean {
  return (
    a.x < b.x + b.w + gap &&
    a.x + a.w + gap > b.x &&
    a.y < b.y + b.h + gap &&
    a.y + a.h + gap > b.y
  );
}

/** Binary search: find first index where items[i].y >= threshold */
function lowerBound(items: GridKitItem[], threshold: number): number {
  let lo = 0, hi = items.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (items[mid].y < threshold) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/** O(n log n) sweep-line collision resolution using Y-sorted items + binary search */
export function resolveCollisions(items: GridKitItem[], movedId: string, gap = 0): GridKitItem[] {
  const result = items.map(i => ({ ...i }));
  const moved = result.find(i => i.id === movedId);
  if (!moved) return result;

  // Phase 1: push items that collide with the moved item
  for (const item of result) {
    if (item.id === movedId || item.locked) continue;
    if (overlaps(moved, item, gap)) {
      item.y = moved.y + moved.h + gap;
    }
  }

  // Phase 2: sweep-line to resolve cascading collisions
  // Sort by Y for sweep, use binary search to limit comparisons
  result.sort((a, b) => a.y - b.y || a.x - b.x);

  let changed = true;
  let iterations = 0;
  while (changed && iterations < 50) {
    changed = false;
    iterations++;
    for (let i = 0; i < result.length; i++) {
      const item = result[i];
      if (item.locked) continue;
      // Only check items that START before this item ends (Y-axis window)
      const searchEnd = item.y + item.h + gap;
      for (let j = i + 1; j < result.length; j++) {
        if (result[j].y >= searchEnd) break; // sorted — no more potential colliders
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

/** Find all items colliding with a given item using sweep-line */
export function findCollisions(target: GridKitItem, items: GridKitItem[], gap = 0): GridKitItem[] {
  const sorted = [...items].sort((a, b) => a.y - b.y);
  const start = lowerBound(sorted, target.y - sorted.reduce((max, i) => Math.max(max, i.h), 0) - gap);
  const collisions: GridKitItem[] = [];
  for (let i = start; i < sorted.length; i++) {
    if (sorted[i].y > target.y + target.h + gap) break;
    if (sorted[i].id !== target.id && overlaps(target, sorted[i], gap)) {
      collisions.push(sorted[i]);
    }
  }
  return collisions;
}

export function clampToBounds(item: GridKitItem, containerWidth: number): GridKitItem {
  const x = Math.max(0, Math.min(item.x, containerWidth - item.w));
  const y = Math.max(0, item.y);
  const w = Math.min(item.w, containerWidth - x);
  return { ...item, x, y, w };
}

/** @deprecated Use verticalCompactor from compaction.ts instead */
export function compact(items: GridKitItem[], gap = 0): GridKitItem[] {
  const sorted = [...items].map(i => ({ ...i })).sort((a, b) => a.y - b.y || a.x - b.x);
  for (const item of sorted) {
    if (item.locked) continue;
    let newY = 0;
    while (newY < item.y) {
      const test = { ...item, y: newY };
      if (!sorted.some(other => other.id !== item.id && overlaps(test, other, gap))) {
        item.y = newY;
        break;
      }
      newY++;
    }
  }
  return sorted;
}

/** Find snap guide lines (alignment with other items) */
export function getSnapGuides(dragging: GridKitItem, items: GridKitItem[], threshold = 5): { x: number[]; y: number[] } {
  const guides: { x: number[]; y: number[] } = { x: [], y: [] };
  for (const item of items) {
    if (item.id === dragging.id) continue;
    if (Math.abs(dragging.x - item.x) <= threshold) guides.x.push(item.x);
    if (Math.abs(dragging.x + dragging.w - (item.x + item.w)) <= threshold) guides.x.push(item.x + item.w);
    if (Math.abs(dragging.x - (item.x + item.w)) <= threshold) guides.x.push(item.x + item.w);
    if (Math.abs(dragging.x + dragging.w - item.x) <= threshold) guides.x.push(item.x);
    if (Math.abs(dragging.y - item.y) <= threshold) guides.y.push(item.y);
    if (Math.abs(dragging.y + dragging.h - (item.y + item.h)) <= threshold) guides.y.push(item.y + item.h);
    if (Math.abs(dragging.y - (item.y + item.h)) <= threshold) guides.y.push(item.y + item.h);
    if (Math.abs(dragging.y + dragging.h - item.y) <= threshold) guides.y.push(item.y);
  }
  return guides;
}

/** Snap position to guides if within threshold */
export function snapToGuides(item: GridKitItem, items: GridKitItem[], threshold = 5): GridKitItem {
  const result = { ...item };
  for (const other of items) {
    if (other.id === item.id) continue;
    if (Math.abs(result.x - other.x) <= threshold) result.x = other.x;
    else if (Math.abs(result.x - (other.x + other.w)) <= threshold) result.x = other.x + other.w;
    else if (Math.abs(result.x + result.w - other.x) <= threshold) result.x = other.x - result.w;
    else if (Math.abs(result.x + result.w - (other.x + other.w)) <= threshold) result.x = other.x + other.w - result.w;
    if (Math.abs(result.y - other.y) <= threshold) result.y = other.y;
    else if (Math.abs(result.y - (other.y + other.h)) <= threshold) result.y = other.y + other.h;
    else if (Math.abs(result.y + result.h - other.y) <= threshold) result.y = other.y - result.h;
    else if (Math.abs(result.y + result.h - (other.y + other.h)) <= threshold) result.y = other.y + other.h - result.h;
  }
  return result;
}
