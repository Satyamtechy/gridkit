import { GridKitItem } from "./types";
import { GridKit } from "./gridkit";

export class GridHistory {
  private stack: GridKitItem[][] = [];
  private pointer = -1;
  private maxHistory: number;

  constructor(maxHistory = 50) {
    this.maxHistory = maxHistory;
  }

  push(state: GridKitItem[]): void {
    // Discard any redo states ahead of current pointer
    this.stack = this.stack.slice(0, this.pointer + 1);
    this.stack.push(state.map(i => ({ ...i })));
    if (this.stack.length > this.maxHistory) {
      this.stack.shift();
    } else {
      this.pointer++;
    }
  }

  undo(): GridKitItem[] | null {
    if (!this.canUndo()) return null;
    this.pointer--;
    return this.stack[this.pointer].map(i => ({ ...i }));
  }

  redo(): GridKitItem[] | null {
    if (!this.canRedo()) return null;
    this.pointer++;
    return this.stack[this.pointer].map(i => ({ ...i }));
  }

  canUndo(): boolean {
    return this.pointer > 0;
  }

  canRedo(): boolean {
    return this.pointer < this.stack.length - 1;
  }

  clear(): void {
    this.stack = [];
    this.pointer = -1;
  }
}

/**
 * Wire history into a GridKit instance.
 * Monkey-patches onChange, and adds undo/redo methods to the grid.
 */
export function enableHistory(grid: GridKit, maxHistory = 50): GridHistory {
  const history = new GridHistory(maxHistory);

  // Push initial state
  history.push(grid.getItems());

  // Intercept onChange by wrapping public mutating methods
  const origAdd = grid.add.bind(grid);
  const origRemove = grid.remove.bind(grid);
  const origUpdate = grid.update.bind(grid);
  const origRedistribute = grid.redistribute.bind(grid);

  grid.add = (item: GridKitItem) => {
    origAdd(item);
    history.push(grid.getItems());
  };
  grid.remove = (id: string) => {
    origRemove(id);
    history.push(grid.getItems());
  };
  grid.update = (id: string, partial: Partial<GridKitItem>) => {
    origUpdate(id, partial);
    history.push(grid.getItems());
  };
  grid.redistribute = (columns: number) => {
    origRedistribute(columns);
    history.push(grid.getItems());
  };

  // Add undo/redo to grid instance
  (grid as GridKit & { undo: () => void; redo: () => void }).undo = () => {
    const state = history.undo();
    if (state) {
      // Replace items without triggering history push
      for (const item of grid.getItems()) origRemove(item.id);
      for (const item of state) origAdd(item);
    }
  };

  (grid as GridKit & { undo: () => void; redo: () => void }).redo = () => {
    const state = history.redo();
    if (state) {
      for (const item of grid.getItems()) origRemove(item.id);
      for (const item of state) origAdd(item);
    }
  };

  return history;
}
