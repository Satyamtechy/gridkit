interface GridKitItem {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
    /** Set false to disable drag on this item. Default: true */
    draggable?: boolean;
    /** Set false to disable resize on this item. Default: true */
    resizable?: boolean;
    /** When true, item won't be pushed by collision. Default: false */
    locked?: boolean;
    zIndex?: number;
    content?: HTMLElement | string;
    /** Nested grid options (opt-in via NestedGridKit) */
    subGrid?: GridKitOptions;
}
interface Breakpoint {
    name: string;
    minWidth: number;
    columns: number;
}
interface Compactor {
    compact(items: GridKitItem[], cols: number, gap: number): GridKitItem[];
}
interface GridKitOptions {
    container: HTMLElement;
    items?: GridKitItem[];
    containerWidth?: number;
    /** Gap between items during collision resolution. Default: 0 */
    gap?: number;
    /** Enable column-based grid mode. Omit for pixel-based freeform. */
    columns?: number;
    /** Row height in px (only used with columns mode) */
    rowHeight?: number;
    /** Minimum item width in px. Default: 50 */
    minItemWidth?: number;
    /** Minimum item height in px. Default: 50 */
    minItemHeight?: number;
    /** Enable collision detection — push overlapping items. Default: false */
    collision?: boolean;
    /** Enable smooth CSS transitions on position changes. Default: false */
    animate?: boolean;
    /** Animation duration in ms. Default: 200 */
    animationDuration?: number;
    /** Constrain items within container bounds. Default: false */
    bounds?: boolean;
    /** Pluggable compaction algorithm. Omit for no compaction. */
    compactor?: Compactor;
    /** Enable snap-to-guide alignment. Default: false */
    snapGuides?: boolean;
    /** Enable keyboard navigation (requires enableKeyboard plugin). Default: false */
    keyboard?: boolean;
    /** Enable responsive breakpoint switching. Default: false */
    responsive?: boolean;
    /** Breakpoint definitions (only used when responsive: true) */
    breakpoints?: Breakpoint[];
    /** Enable undo/redo (requires enableHistory plugin). Default: false */
    undoRedo?: boolean;
    /** Max history states for undo/redo. Default: 50 */
    maxHistory?: number;
    /** Which resize handles to show. Default: all 8 */
    resizeHandles?: ResizeDirection[];
    onDragStart?: (item: GridKitItem) => void;
    onDrag?: (item: GridKitItem) => void;
    onDragEnd?: (item: GridKitItem) => void;
    onResizeStart?: (item: GridKitItem) => void;
    onResize?: (item: GridKitItem) => void;
    onResizeEnd?: (item: GridKitItem) => void;
    onChange?: (items: GridKitItem[]) => void;
    onDragFromOutside?: (item: GridKitItem) => void;
}
type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export type { Breakpoint as B, Compactor as C, GridKitItem as G, ResizeDirection as R, GridKitOptions as a };
