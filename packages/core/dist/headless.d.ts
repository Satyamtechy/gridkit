import { C as Compactor, G as GridKitItem } from './types-CePEgoHy.js';

interface HeadlessOptions {
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
declare function computeLayout(items: GridKitItem[], options: HeadlessOptions): GridKitItem[];
/**
 * Compute layout in grid-unit mode and return grid units (not pixels).
 * Useful for SSR when you need to set CSS grid placement.
 */
declare function computeGridLayout(items: GridKitItem[], options: Omit<HeadlessOptions, "rowHeight"> & {
    columns: number;
}): GridKitItem[];

export { type HeadlessOptions, computeGridLayout, computeLayout };
