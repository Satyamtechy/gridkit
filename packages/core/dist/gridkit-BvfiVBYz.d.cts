import { a as GridKitOptions, G as GridKitItem } from './types-CePEgoHy.cjs';

declare class GridKit {
    private container;
    private items;
    private elements;
    private opts;
    private containerWidth;
    private activeId;
    private cleanup;
    private compactor;
    private layouts;
    private currentBreakpoint;
    private resizeObserver;
    private placeholder;
    constructor(options: GridKitOptions);
    add(item: GridKitItem): void;
    remove(id: string): void;
    update(id: string, partial: Partial<GridKitItem>): void;
    getItems(): GridKitItem[];
    getItem(id: string): GridKitItem | undefined;
    layout(): void;
    redistribute(columns: number): void;
    /** Convert grid-unit item to pixel values */
    toPixels(item: GridKitItem): GridKitItem;
    /** Convert pixel-based item to grid units */
    toGridUnits(item: GridKitItem): GridKitItem;
    /** Set layout for a named breakpoint */
    setBreakpointLayout(name: string, items: GridKitItem[]): void;
    /** Get current active breakpoint name */
    getCurrentBreakpoint(): string | null;
    /** Enable the container as a drop zone for external drags */
    enableDropZone(): void;
    /** Run compaction on current items (only if compactor is configured) */
    runCompaction(): void;
    destroy(): void;
    private initResponsive;
    private showPlaceholder;
    private removePlaceholder;
    private render;
    private positionElement;
    private createElement;
    private makeDraggable;
    private static RESIZE_HANDLES;
    private makeResizable;
    static create(container: HTMLElement | string, options?: Partial<Omit<GridKitOptions, "container">>): GridKit;
}

export { GridKit as G };
