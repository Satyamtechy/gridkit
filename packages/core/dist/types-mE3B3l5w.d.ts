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
    draggable?: boolean;
    resizable?: boolean;
    locked?: boolean;
    zIndex?: number;
    content?: HTMLElement | string;
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
    gap?: number;
    columns?: number;
    rowHeight?: number;
    minItemWidth?: number;
    minItemHeight?: number;
    collision?: boolean;
    animate?: boolean;
    animationDuration?: number;
    bounds?: boolean;
    compact?: boolean;
    compactor?: Compactor;
    snapGuides?: boolean;
    keyboard?: boolean;
    responsive?: boolean;
    breakpoints?: Breakpoint[];
    undoRedo?: boolean;
    maxHistory?: number;
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
