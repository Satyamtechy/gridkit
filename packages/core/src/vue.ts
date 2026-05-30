import { GridKit } from "./gridkit";
import type { GridKitItem, GridKitOptions } from "./types";

/** Minimal Vue Ref interface — avoids importing 'vue' */
interface Ref<T> { value: T }
interface ShallowRef<T> { value: T }

type VueGridOptions = Omit<GridKitOptions, "container"> & {
  containerRef?: Ref<HTMLElement | null>;
};

interface GridKitComposableReturn {
  grid: ShallowRef<GridKit | null>;
  items: Ref<GridKitItem[]>;
  addItem: (item: GridKitItem) => void;
  removeItem: (id: string) => void;
  undo: () => void;
  redo: () => void;
}

/**
 * Vue composable factory for GridKit.
 * Accepts Vue reactivity functions to avoid bundling Vue.
 *
 * Usage:
 * ```ts
 * import { ref, shallowRef, onMounted, onUnmounted } from 'vue';
 * import { createVueGridKit } from 'gridkit-layout/vue';
 * const useGridKit = createVueGridKit({ ref, shallowRef, onMounted, onUnmounted });
 * ```
 */
export function createUseGridKit(vue: {
  ref: <T>(value: T) => Ref<T>;
  shallowRef: <T>(value: T) => ShallowRef<T>;
  onMounted: (fn: () => void) => void;
  onUnmounted: (fn: () => void) => void;
}) {
  const { ref, shallowRef, onMounted, onUnmounted } = vue;

  return function useGridKit(options: VueGridOptions = {}): GridKitComposableReturn {
    const grid = shallowRef<GridKit | null>(null);
    const items = ref<GridKitItem[]>(options.items ?? []);
    let ro: ResizeObserver | null = null;

    onMounted(() => {
      const el = options.containerRef?.value;
      if (!el) return;

      const instance = new GridKit({
        ...options,
        container: el,
        onChange: (newItems) => {
          items.value = newItems;
          options.onChange?.(newItems);
        },
      });
      grid.value = instance;
      items.value = instance.getItems();

      ro = new ResizeObserver(() => instance.layout());
      ro.observe(el);
    });

    onUnmounted(() => {
      ro?.disconnect();
      grid.value?.destroy();
      grid.value = null;
    });

    const addItem = (item: GridKitItem) => grid.value?.add(item);
    const removeItem = (id: string) => grid.value?.remove(id);
    const undo = () => (grid.value as unknown as { undo?: () => void })?.undo?.();
    const redo = () => (grid.value as unknown as { redo?: () => void })?.redo?.();

    return { grid, items, addItem, removeItem, undo, redo };
  };
}

export type { VueGridOptions, GridKitComposableReturn, Ref, ShallowRef };
