import { GridKit } from "./gridkit";
import { GridKitItem, GridKitOptions } from "./types";

export interface NestedGridEntry {
  parentItemId: string;
  childGrid: GridKit;
}

export class NestedGridKit {
  private parent: GridKit;
  private children = new Map<string, GridKit>();

  constructor(options: GridKitOptions) {
    this.parent = new GridKit(options);
    // Auto-create sub-grids for items that have subGrid config
    for (const item of options.items ?? []) {
      if (item.subGrid) {
        this.createSubGrid(item.id, item.subGrid);
      }
    }
  }

  getParent(): GridKit {
    return this.parent;
  }

  getChild(parentItemId: string): GridKit | undefined {
    return this.children.get(parentItemId);
  }

  createSubGrid(parentItemId: string, options: Omit<GridKitOptions, "container">): GridKit {
    const parentEl = this.findElement(parentItemId);
    if (!parentEl) throw new Error(`Item ${parentItemId} not found in DOM`);

    // Create a container for the child grid inside the parent item
    const childContainer = document.createElement("div");
    Object.assign(childContainer.style, {
      position: "absolute",
      inset: "0",
      overflow: "hidden",
    });
    parentEl.appendChild(childContainer);

    // Isolate pointer events so child drags don't bubble to parent
    childContainer.addEventListener("pointerdown", (e) => e.stopPropagation());

    const childGrid = new GridKit({ ...options, container: childContainer });
    this.children.set(parentItemId, childGrid);
    return childGrid;
  }

  removeSubGrid(parentItemId: string): void {
    const child = this.children.get(parentItemId);
    if (child) {
      child.destroy();
      this.children.delete(parentItemId);
    }
  }

  destroy(): void {
    this.children.forEach(child => child.destroy());
    this.children.clear();
    this.parent.destroy();
  }

  private findElement(itemId: string): HTMLElement | null {
    return this.parent["container"].querySelector(`[data-gridkit-id="${itemId}"]`);
  }
}

/**
 * Enable dragging items between a parent and child grid.
 * When an item is dragged out of childGrid bounds, it transfers to parentGrid.
 */
export function enableNestedDrag(parentGrid: GridKit, childGrid: GridKit): () => void {
  const parentContainer = parentGrid["container"] as HTMLElement;
  const childContainer = childGrid["container"] as HTMLElement;

  const onPointerUp = (e: PointerEvent) => {
    const childRect = childContainer.getBoundingClientRect();
    const parentRect = parentContainer.getBoundingClientRect();
    const x = e.clientX, y = e.clientY;

    // Check if pointer is outside child but inside parent — transfer item
    if (
      (x < childRect.left || x > childRect.right || y < childRect.top || y > childRect.bottom) &&
      x >= parentRect.left && x <= parentRect.right &&
      y >= parentRect.top && y <= parentRect.bottom
    ) {
      const childItems = childGrid.getItems();
      // Find the item that was being dragged (highest zIndex or last moved)
      const dragged = childItems.find(i => {
        const el = childContainer.querySelector(`[data-gridkit-id="${i.id}"]`) as HTMLElement;
        return el?.style.zIndex === "1000";
      });

      if (dragged) {
        childGrid.remove(dragged.id);
        const newX = x - parentRect.left - dragged.w / 2;
        const newY = y - parentRect.top - dragged.h / 2;
        parentGrid.add({ ...dragged, x: Math.max(0, newX), y: Math.max(0, newY) });
      }
    }
  };

  childContainer.addEventListener("pointerup", onPointerUp);
  return () => childContainer.removeEventListener("pointerup", onPointerUp);
}
