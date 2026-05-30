import {
  GridKit
} from "./chunk-XMLQDIQV.mjs";

// src/react.ts
function createUseGridKit(hooks) {
  const { useState, useEffect, useRef, useCallback } = hooks;
  return function useGridKit(containerRef, options = {}) {
    const [items, setItems] = useState(options.items ?? []);
    const gridRef = useRef(null);
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
        }
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
    const addItem = useCallback((item) => {
      gridRef.current?.add(item);
    }, []);
    const removeItem = useCallback((id) => {
      gridRef.current?.remove(id);
    }, []);
    const undo = useCallback(() => {
      gridRef.current?.undo?.();
    }, []);
    const redo = useCallback(() => {
      gridRef.current?.redo?.();
    }, []);
    return { grid: gridRef.current, items, addItem, removeItem, undo, redo };
  };
}

export {
  createUseGridKit
};
