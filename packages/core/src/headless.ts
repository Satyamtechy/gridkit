import type { GridKitItem, Compactor } from "./types";
import { resolveCollisions } from "./collision";
import { verticalCompactor } from "./compaction";

export interface HeadlessOptions {
  containerWidth: number;
  gap?: number;
  columns?: number;
  rowHeight?: number;
  compactor?: Compactor;
  collision?: boolean;
  bounds?: boolean;
}

/**
 * Pure layout computation — no DOM, no events.
 * Returns items with resolved positions (pixel values).
 * Supports both pixel mode and column/row mode.
 */
export function computeLayout(items: GridKitItem[], options: HeadlessOptions): GridKitItem[] {
  const { containerWidth, gap = 10, columns, rowHeight, bounds = true, collision = true } = options;
  const comp = options.compactor ?? verticalCompactor;

  let resolved = items.map(i => ({ ...i }));

  // Column mode: convert grid units to pixels
  if (columns && rowHeight) {
    const colW = (containerWidth - (columns - 1) * gap) / columns;
    resolved = resolved.map(item => ({
      ...item,
      x: item.x * (colW + gap),
      y: item.y * (rowHeight + gap),
      w: item.w * colW + (item.w - 1) * gap,
      h: item.h * rowHeight + (item.h - 1) * gap,
    }));
  }

  // Compaction
  const cols = columns ?? Math.floor((containerWidth + gap) / (100 + gap));
  resolved = comp.compact(resolved, cols, gap);

  // Collision resolution
  if (collision && resolved.length > 1) {
    for (const item of resolved) {
      resolved = resolveCollisions(resolved, item.id, gap);
    }
  }

  // Clamp to bounds
  if (bounds) {
    resolved = resolved.map(item => ({
      ...item,
      x: Math.max(0, Math.min(item.x, containerWidth - item.w)),
      y: Math.max(0, item.y),
    }));
  }

  return resolved;
}

/**
 * Compute layout in grid-unit mode and return grid units (not pixels).
 * Useful for SSR when you need to set CSS grid placement.
 */
export function computeGridLayout(
  items: GridKitItem[],
  options: Omit<HeadlessOptions, "rowHeight"> & { columns: number }
): GridKitItem[] {
  const { columns, gap = 0 } = options;
  const comp = options.compactor ?? verticalCompactor;
  return comp.compact(items.map(i => ({ ...i })), columns, gap);
}
