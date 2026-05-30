import { GridKit } from "./gridkit";
import { GridKitItem } from "./types";

const FOCUS_RING = "0 0 0 2px #3b9eff";
const MOVE_PX = 10;

export class KeyboardPlugin {
  private grid: GridKit;
  private container: HTMLElement;
  private focusedId: string | null = null;
  private elements: HTMLElement[] = [];
  private onKeyDown: (e: KeyboardEvent) => void;
  private cleanup: (() => void)[] = [];

  constructor(grid: GridKit, container: HTMLElement) {
    this.grid = grid;
    this.container = container;
    this.onKeyDown = this.handleKeyDown.bind(this);
    this.init();
  }

  private init(): void {
    this.syncElements();
    this.container.addEventListener("keydown", this.onKeyDown);
    this.cleanup.push(() => this.container.removeEventListener("keydown", this.onKeyDown));

    // Observe DOM changes to keep element list current
    const observer = new MutationObserver(() => this.syncElements());
    observer.observe(this.container, { childList: true });
    this.cleanup.push(() => observer.disconnect());
  }

  private syncElements(): void {
    this.elements = Array.from(
      this.container.querySelectorAll<HTMLElement>("[data-gridkit-id]")
    );
    for (const el of this.elements) {
      if (!el.getAttribute("tabindex")) {
        el.setAttribute("tabindex", "0");
      }
      if (!el.dataset.kbBound) {
        el.dataset.kbBound = "1";
        el.addEventListener("focus", () => {
          this.focusedId = el.dataset.gridkitId ?? null;
          el.style.boxShadow = FOCUS_RING;
        });
        el.addEventListener("blur", () => {
          el.style.boxShadow = "";
        });
      }
    }
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (e.key === "Tab") {
      this.handleTab(e);
      return;
    }
    if (e.key === "Escape") {
      this.deselect();
      return;
    }
    if (!this.focusedId) return;

    const item = this.grid.getItem(this.focusedId);
    if (!item) return;

    const shift = e.shiftKey;
    const delta = MOVE_PX;
    let partial: Partial<GridKitItem> | null = null;

    switch (e.key) {
      case "ArrowLeft":
        partial = shift ? { w: Math.max(item.minW ?? 50, item.w - delta) } : { x: item.x - delta };
        break;
      case "ArrowRight":
        partial = shift ? { w: item.w + delta } : { x: item.x + delta };
        break;
      case "ArrowUp":
        partial = shift ? { h: Math.max(item.minH ?? 50, item.h - delta) } : { y: item.y - delta };
        break;
      case "ArrowDown":
        partial = shift ? { h: item.h + delta } : { y: item.y + delta };
        break;
    }

    if (partial) {
      e.preventDefault();
      this.grid.update(this.focusedId, partial);
    }
  }

  private handleTab(e: KeyboardEvent): void {
    if (this.elements.length === 0) return;
    e.preventDefault();
    const currentIdx = this.elements.findIndex(
      el => el.dataset.gridkitId === this.focusedId
    );
    const next = e.shiftKey
      ? (currentIdx - 1 + this.elements.length) % this.elements.length
      : (currentIdx + 1) % this.elements.length;
    this.elements[next]?.focus();
  }

  private deselect(): void {
    this.focusedId = null;
    (document.activeElement as HTMLElement)?.blur?.();
  }

  destroy(): void {
    this.cleanup.forEach(fn => fn());
    this.cleanup = [];
    for (const el of this.elements) {
      el.removeAttribute("tabindex");
      el.style.boxShadow = "";
    }
  }
}

export function enableKeyboard(grid: GridKit, container: HTMLElement): KeyboardPlugin {
  return new KeyboardPlugin(grid, container);
}
