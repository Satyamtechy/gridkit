import { G as GridKit } from './gridkit-Cugt3Rgc.mjs';
import { G as GridKitItem, a as GridKitOptions } from './types-CePEgoHy.mjs';

/** Minimal React RefObject interface — avoids importing 'react' */
interface RefObject<T> {
    current: T;
}
type ReactGridOptions = Omit<GridKitOptions, "container"> & {
    onItemsChange?: (items: GridKitItem[]) => void;
};
interface GridKitHookReturn {
    grid: GridKit | null;
    items: GridKitItem[];
    addItem: (item: GridKitItem) => void;
    removeItem: (id: string) => void;
    undo: () => void;
    redo: () => void;
}
/**
 * React hook factory for GridKit. Requires React 18+.
 *
 * Usage:
 * ```ts
 * import { useState, useEffect, useRef, useCallback } from 'react';
 * import { createReactGridKit } from 'gridkit-layout/react';
 * const useGridKit = createReactGridKit({ useState, useEffect, useRef, useCallback });
 * ```
 */
declare function createUseGridKit(hooks: {
    useState: <T>(init: T) => [T, (v: T | ((prev: T) => T)) => void];
    useEffect: (fn: () => void | (() => void), deps?: unknown[]) => void;
    useRef: <T>(init: T) => {
        current: T;
    };
    useCallback: <T extends (...args: never[]) => unknown>(fn: T, deps: unknown[]) => T;
}): (containerRef: RefObject<HTMLElement | null>, options?: ReactGridOptions) => GridKitHookReturn;

export { type GridKitHookReturn, type ReactGridOptions, type RefObject, createUseGridKit };
