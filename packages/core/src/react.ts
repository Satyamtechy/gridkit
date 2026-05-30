import { GridKit } from "./gridkit";
import type { GridKitItem, GridKitOptions } from "./types";

/** Minimal React RefObject interface — avoids importing 'react' */
interface RefObject<T> { current: T }

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
export function createUseGridKit(hooks: {
  useState: <T>(init: T) => [T, (v: T | ((prev: T) => T)) => void];
  useEffect: (fn: () => void | (() => void), deps?: unknown[]) => void;
  useRef: <T>(init: T) => { current: T };
  useCallback: <T extends (...args: never[]) => unknown>(fn: T, deps: unknown[]) => T;
}) {
  const { useState, useEffect, useRef, useCallback } = hooks;

  return function useGridKit(
    containerRef: RefObject<HTMLElement | null>,
    options: ReactGridOptions = {}
  ): GridKitHookReturn {
    const [items, setItems] = useState<GridKitItem[]>(options.items ?? []);
    const gridRef = useRef<GridKit | null>(null);

    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      const grid = new GridKit({
        ...options,
        container: el,
        onChange: (newItems) => {
          setItems(newItems);
          options.onItemsChange?.(newItems);
          options.onChange?.(newItems);
        },
      });
      gridRef.current = grid;
      setItems(grid.getItems());

      const ro = new ResizeObserver(() => grid.layout());
      ro.observe(el);

      return () => {
        ro.disconnect();
        grid.destroy();
        gridRef.current = null;
      };
    }, []);

    const addItem = useCallback((item: GridKitItem) => {
      gridRef.current?.add(item);
    }, []);

    const removeItem = useCallback((id: string) => {
      gridRef.current?.remove(id);
    }, []);

    const undo = useCallback(() => {
      (gridRef.current as unknown as { undo?: () => void })?.undo?.();
    }, []);

    const redo = useCallback(() => {
      (gridRef.current as unknown as { redo?: () => void })?.redo?.();
    }, []);

    return { grid: gridRef.current, items, addItem, removeItem, undo, redo };
  };
}

export type { ReactGridOptions, GridKitHookReturn, RefObject };
