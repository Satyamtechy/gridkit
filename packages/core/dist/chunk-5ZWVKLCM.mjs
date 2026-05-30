import {
  GridKit
} from "./chunk-XMLQDIQV.mjs";

// src/vue.ts
function createUseGridKit(vue) {
  const { ref, shallowRef, onMounted, onUnmounted } = vue;
  return function useGridKit(options = {}) {
    const grid = shallowRef(null);
    const items = ref(options.items ?? []);
    let ro = null;
    onMounted(() => {
      const el = options.containerRef?.value;
      if (!el) return;
      const instance = new GridKit({
        ...options,
        container: el,
        onChange: (newItems) => {
          items.value = newItems;
          options.onChange?.(newItems);
        }
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
    const addItem = (item) => grid.value?.add(item);
    const removeItem = (id) => grid.value?.remove(id);
    const undo = () => grid.value?.undo?.();
    const redo = () => grid.value?.redo?.();
    return { grid, items, addItem, removeItem, undo, redo };
  };
}

export {
  createUseGridKit
};
