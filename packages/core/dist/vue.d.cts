import { G as GridKit } from './gridkit-BvfiVBYz.cjs';
import { G as GridKitItem, a as GridKitOptions } from './types-CePEgoHy.cjs';

/** Minimal Vue Ref interface — avoids importing 'vue' */
interface Ref<T> {
    value: T;
}
interface ShallowRef<T> {
    value: T;
}
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
declare function createUseGridKit(vue: {
    ref: <T>(value: T) => Ref<T>;
    shallowRef: <T>(value: T) => ShallowRef<T>;
    onMounted: (fn: () => void) => void;
    onUnmounted: (fn: () => void) => void;
}): (options?: VueGridOptions) => GridKitComposableReturn;

export { type GridKitComposableReturn, type Ref, type ShallowRef, type VueGridOptions, createUseGridKit };
