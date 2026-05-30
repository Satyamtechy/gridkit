import { G as GridKit } from './gridkit-Cugt3Rgc.mjs';
import { G as GridKitItem, C as Compactor, a as GridKitOptions } from './types-CePEgoHy.mjs';
export { B as Breakpoint, R as ResizeDirection } from './types-CePEgoHy.mjs';
export { GridKitHookReturn, ReactGridOptions, RefObject, createUseGridKit as createReactGridKit } from './react.mjs';
export { GridKitComposableReturn, VueGridOptions, createUseGridKit as createVueGridKit } from './vue.mjs';
export { HeadlessOptions, computeGridLayout, computeLayout } from './headless.mjs';

declare function overlaps(a: GridKitItem, b: GridKitItem, gap?: number): boolean;
/** O(n log n) sweep-line collision resolution using Y-sorted items + binary search */
declare function resolveCollisions(items: GridKitItem[], movedId: string, gap?: number): GridKitItem[];
/** Find all items colliding with a given item using sweep-line */
declare function findCollisions(target: GridKitItem, items: GridKitItem[], gap?: number): GridKitItem[];
declare function clampToBounds(item: GridKitItem, containerWidth: number): GridKitItem;
/** @deprecated Use verticalCompactor from compaction.ts instead */
declare function compact(items: GridKitItem[], gap?: number): GridKitItem[];
/** Find snap guide lines (alignment with other items) */
declare function getSnapGuides(dragging: GridKitItem, items: GridKitItem[], threshold?: number): {
    x: number[];
    y: number[];
};
/** Snap position to guides if within threshold */
declare function snapToGuides(item: GridKitItem, items: GridKitItem[], threshold?: number): GridKitItem;

/** Vertical compaction — move items up to fill gaps */
declare const verticalCompactor: Compactor;
/** Horizontal compaction — move items left to fill gaps */
declare const horizontalCompactor: Compactor;
/** No compaction — leave items where they are */
declare const noCompactor: Compactor;

declare class GridHistory {
    private stack;
    private pointer;
    private maxHistory;
    constructor(maxHistory?: number);
    push(state: GridKitItem[]): void;
    undo(): GridKitItem[] | null;
    redo(): GridKitItem[] | null;
    canUndo(): boolean;
    canRedo(): boolean;
    clear(): void;
}
/**
 * Wire history into a GridKit instance.
 * Monkey-patches onChange, and adds undo/redo methods to the grid.
 */
declare function enableHistory(grid: GridKit, maxHistory?: number): GridHistory;

declare class KeyboardPlugin {
    private grid;
    private container;
    private focusedId;
    private elements;
    private onKeyDown;
    private cleanup;
    constructor(grid: GridKit, container: HTMLElement);
    private init;
    private syncElements;
    private handleKeyDown;
    private handleTab;
    private deselect;
    destroy(): void;
}
declare function enableKeyboard(grid: GridKit, container: HTMLElement): KeyboardPlugin;

declare class NestedGridKit {
    private parent;
    private children;
    constructor(options: GridKitOptions);
    getParent(): GridKit;
    getChild(parentItemId: string): GridKit | undefined;
    createSubGrid(parentItemId: string, options: Omit<GridKitOptions, "container">): GridKit;
    removeSubGrid(parentItemId: string): void;
    destroy(): void;
    private findElement;
}
/**
 * Enable dragging items between a parent and child grid.
 * When an item is dragged out of childGrid bounds, it transfers to parentGrid.
 */
declare function enableNestedDrag(parentGrid: GridKit, childGrid: GridKit): () => void;

export { Compactor, GridHistory, GridKit, GridKitItem, GridKitOptions, KeyboardPlugin, NestedGridKit, clampToBounds, compact, enableHistory, enableKeyboard, enableNestedDrag, findCollisions, getSnapGuides, horizontalCompactor, noCompactor, overlaps, resolveCollisions, snapToGuides, verticalCompactor };
