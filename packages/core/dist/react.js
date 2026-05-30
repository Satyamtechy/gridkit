// src/collision.ts
function overlaps(a, b, gap = 0) {
  return a.x < b.x + b.w + gap && a.x + a.w + gap > b.x && a.y < b.y + b.h + gap && a.y + a.h + gap > b.y;
}
function resolveCollisions(items, movedId, gap = 0) {
  const result = items.map((i) => ({ ...i }));
  const moved = result.find((i) => i.id === movedId);
  if (!moved) return result;
  for (const item of result) {
    if (item.id === movedId || item.locked) continue;
    if (overlaps(moved, item, gap)) {
      item.y = moved.y + moved.h + gap;
    }
  }
  result.sort((a, b) => a.y - b.y || a.x - b.x);
  let changed = true;
  let iterations = 0;
  while (changed && iterations < 50) {
    changed = false;
    iterations++;
    for (let i = 0; i < result.length; i++) {
      const item = result[i];
      if (item.locked) continue;
      const searchEnd = item.y + item.h + gap;
      for (let j = i + 1; j < result.length; j++) {
        if (result[j].y >= searchEnd) break;
        if (result[j].locked) continue;
        if (overlaps(item, result[j], gap)) {
          result[j].y = item.y + item.h + gap;
          changed = true;
        }
      }
    }
    if (changed) result.sort((a, b) => a.y - b.y || a.x - b.x);
  }
  return result;
}

// src/gridkit.ts
var DEFAULTS = {
  gap: 0,
  minItemWidth: 50,
  minItemHeight: 50,
  collision: false,
  animate: false,
  animationDuration: 200,
  bounds: false
};
var _GridKit = class _GridKit {
  constructor(options) {
    this.items = [];
    this.elements = /* @__PURE__ */ new Map();
    this.activeId = null;
    this.cleanup = [];
    this.layouts = /* @__PURE__ */ new Map();
    this.currentBreakpoint = null;
    this.resizeObserver = null;
    this.placeholder = null;
    this.container = options.container;
    this.opts = { ...DEFAULTS, ...options };
    this.containerWidth = options.containerWidth ?? this.container.offsetWidth;
    this.items = (options.items ?? []).map((i) => ({ ...i }));
    this.compactor = options.compactor ?? null;
    this.container.style.position = "relative";
    if (options.responsive && options.breakpoints?.length) this.initResponsive(options.breakpoints);
    this.render();
  }
  // --- PUBLIC API ---
  add(item) {
    this.items.push({ ...item });
    if (this.opts.collision) this.items = resolveCollisions(this.items, item.id, this.opts.gap);
    this.render();
    this.opts.onChange?.(this.getItems());
  }
  remove(id) {
    this.items = this.items.filter((i) => i.id !== id);
    this.elements.get(id)?.remove();
    this.elements.delete(id);
    this.opts.onChange?.(this.getItems());
  }
  update(id, partial) {
    this.items = this.items.map((i) => i.id === id ? { ...i, ...partial } : i);
    if (this.opts.collision) this.items = resolveCollisions(this.items, id, this.opts.gap);
    this.render();
    this.opts.onChange?.(this.getItems());
  }
  getItems() {
    return this.items.map((i) => ({ ...i }));
  }
  getItem(id) {
    return this.items.find((i) => i.id === id);
  }
  layout() {
    this.containerWidth = this.opts.containerWidth ?? this.container.offsetWidth;
    this.render();
  }
  redistribute(columns) {
    const gap = this.opts.gap;
    const colW = Math.floor((this.containerWidth - (columns - 1) * gap) / columns);
    let col = 0, rowY = 0, rowH = 0;
    this.items = this.items.map((item) => {
      const span = item.w > colW * 1.3 ? Math.min(2, columns) : 1;
      const itemW = span * colW + (span - 1) * gap;
      if (col + span > columns) {
        col = 0;
        rowY += rowH + gap;
        rowH = 0;
      }
      const x = col * (colW + gap), y = rowY;
      col += span;
      rowH = Math.max(rowH, item.h);
      return { ...item, x, y, w: itemW };
    });
    this.render();
    this.opts.onChange?.(this.getItems());
  }
  /** Convert grid-unit item to pixel values */
  toPixels(item) {
    const cols = this.opts.columns;
    const rh = this.opts.rowHeight;
    if (!cols || !rh) return { ...item };
    const gap = this.opts.gap;
    const colW = (this.containerWidth - (cols - 1) * gap) / cols;
    return { ...item, x: item.x * (colW + gap), y: item.y * (rh + gap), w: item.w * colW + (item.w - 1) * gap, h: item.h * rh + (item.h - 1) * gap };
  }
  /** Convert pixel-based item to grid units */
  toGridUnits(item) {
    const cols = this.opts.columns;
    const rh = this.opts.rowHeight;
    if (!cols || !rh) return { ...item };
    const gap = this.opts.gap;
    const colW = (this.containerWidth - (cols - 1) * gap) / cols;
    return { ...item, x: Math.round(item.x / (colW + gap)), y: Math.round(item.y / (rh + gap)), w: Math.round((item.w + gap) / (colW + gap)), h: Math.round((item.h + gap) / (rh + gap)) };
  }
  /** Set layout for a named breakpoint */
  setBreakpointLayout(name, items) {
    this.layouts.set(name, items.map((i) => ({ ...i })));
  }
  /** Get current active breakpoint name */
  getCurrentBreakpoint() {
    return this.currentBreakpoint;
  }
  /** Enable the container as a drop zone for external drags */
  enableDropZone() {
    const onDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
      this.showPlaceholder(e.clientX, e.clientY);
    };
    const onDragEnter = (e) => {
      e.preventDefault();
    };
    const onDragLeave = (e) => {
      if (!this.container.contains(e.relatedTarget)) this.removePlaceholder();
    };
    const onDrop = (e) => {
      e.preventDefault();
      this.removePlaceholder();
      const rect = this.container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top + this.container.scrollTop;
      const item = { id: `drop-${Date.now()}`, x, y, w: this.opts.minItemWidth, h: this.opts.minItemHeight };
      this.opts.onDragFromOutside?.(item);
    };
    this.container.addEventListener("dragover", onDragOver);
    this.container.addEventListener("dragenter", onDragEnter);
    this.container.addEventListener("dragleave", onDragLeave);
    this.container.addEventListener("drop", onDrop);
    this.cleanup.push(() => {
      this.container.removeEventListener("dragover", onDragOver);
      this.container.removeEventListener("dragenter", onDragEnter);
      this.container.removeEventListener("dragleave", onDragLeave);
      this.container.removeEventListener("drop", onDrop);
    });
  }
  /** Run compaction on current items (only if compactor is configured) */
  runCompaction() {
    if (!this.compactor) return;
    const cols = this.opts.columns ?? Math.floor(this.containerWidth / this.opts.minItemWidth);
    this.items = this.compactor.compact(this.items, cols, this.opts.gap);
    this.render();
    this.opts.onChange?.(this.getItems());
  }
  destroy() {
    this.resizeObserver?.disconnect();
    this.cleanup.forEach((fn) => fn());
    this.cleanup = [];
    this.elements.forEach((el) => el.remove());
    this.elements.clear();
  }
  // --- RESPONSIVE ---
  initResponsive(breakpoints) {
    const sorted = [...breakpoints].sort((a, b) => b.minWidth - a.minWidth);
    this.resizeObserver = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      this.containerWidth = width;
      const bp = sorted.find((b) => width >= b.minWidth) ?? sorted[sorted.length - 1];
      if (bp.name !== this.currentBreakpoint) {
        this.currentBreakpoint = bp.name;
        const layout = this.layouts.get(bp.name);
        if (layout) this.items = layout.map((i) => ({ ...i }));
        else this.redistribute(bp.columns);
      }
      this.render();
    });
    this.resizeObserver.observe(this.container);
  }
  // --- DROP ZONE PLACEHOLDER ---
  showPlaceholder(clientX, clientY) {
    const rect = this.container.getBoundingClientRect();
    if (!this.placeholder) {
      this.placeholder = document.createElement("div");
      Object.assign(this.placeholder.style, {
        position: "absolute",
        border: "2px dashed #3b9eff",
        borderRadius: "4px",
        background: "rgba(59,158,255,0.08)",
        pointerEvents: "none",
        transition: "all 150ms ease"
      });
      this.container.appendChild(this.placeholder);
    }
    Object.assign(this.placeholder.style, {
      left: `${clientX - rect.left - this.opts.minItemWidth / 2}px`,
      top: `${clientY - rect.top + this.container.scrollTop - this.opts.minItemHeight / 2}px`,
      width: `${this.opts.minItemWidth}px`,
      height: `${this.opts.minItemHeight}px`
    });
  }
  removePlaceholder() {
    this.placeholder?.remove();
    this.placeholder = null;
  }
  // --- RENDERING (batched DOM writes) ---
  render() {
    let maxH = 400;
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      const bottom = item.y + item.h;
      if (bottom > maxH) maxH = bottom;
    }
    this.container.style.height = `${maxH + 50}px`;
    for (const item of this.items) {
      let el = this.elements.get(item.id);
      if (!el) {
        el = this.createElement(item);
        this.container.appendChild(el);
        this.elements.set(item.id, el);
      }
      const px = this.opts.columns ? this.toPixels(item) : item;
      this.positionElement(el, px);
    }
  }
  positionElement(el, item) {
    const animate = this.opts.animate && this.activeId !== item.id;
    const d = this.opts.animationDuration;
    el.style.position = "absolute";
    el.style.width = `${item.w}px`;
    el.style.height = `${item.h}px`;
    el.style.transform = `translate3d(${item.x}px, ${item.y}px, 0)`;
    el.style.transition = animate ? `transform ${d}ms cubic-bezier(0.2,0,0,1), width ${d}ms ease, height ${d}ms ease` : "none";
  }
  createElement(item) {
    const el = document.createElement("div");
    el.dataset.gridkitId = item.id;
    el.style.boxSizing = "border-box";
    if (typeof item.content === "string") el.innerHTML = item.content;
    else if (item.content instanceof HTMLElement) el.appendChild(item.content);
    if (item.draggable !== false) this.makeDraggable(el, item.id);
    if (item.resizable !== false) this.makeResizable(el, item.id);
    return el;
  }
  // --- DRAG ---
  makeDraggable(el, id) {
    const handle = document.createElement("div");
    Object.assign(handle.style, { position: "absolute", inset: "6px", cursor: "grab", zIndex: "1" });
    handle.dataset.gridkitDrag = "";
    el.appendChild(handle);
    const onDown = (e) => {
      e.preventDefault();
      const item = this.items.find((i) => i.id === id);
      if (!item || item.locked) return;
      this.activeId = id;
      el.style.zIndex = "1000";
      el.style.willChange = "transform";
      handle.style.cursor = "grabbing";
      const startX = e.clientX, startY = e.clientY, origX = item.x, origY = item.y;
      let rafId = 0;
      this.opts.onDragStart?.(item);
      const onMove = (ev) => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          let newX = origX + (ev.clientX - startX), newY = origY + (ev.clientY - startY);
          if (this.opts.bounds) {
            newX = Math.max(0, Math.min(newX, this.containerWidth - item.w));
            newY = Math.max(0, newY);
          }
          el.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
          el.style.transition = "none";
          item.x = newX;
          item.y = newY;
          this.opts.onDrag?.(item);
        });
      };
      const onUp = () => {
        cancelAnimationFrame(rafId);
        this.activeId = null;
        el.style.zIndex = "";
        el.style.willChange = "";
        handle.style.cursor = "grab";
        if (this.opts.collision) this.items = resolveCollisions(this.items, id, this.opts.gap);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        this.render();
        this.opts.onDragEnd?.(item);
        this.opts.onChange?.(this.getItems());
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    };
    handle.addEventListener("pointerdown", onDown);
    this.cleanup.push(() => handle.removeEventListener("pointerdown", onDown));
  }
  makeResizable(el, id) {
    const allowedDirs = this.opts.resizeHandles;
    const handles = allowedDirs ? _GridKit.RESIZE_HANDLES.filter((h) => allowedDirs.includes(h.dir)) : _GridKit.RESIZE_HANDLES;
    for (const { dir, css } of handles) {
      const handle = document.createElement("div");
      handle.style.cssText = `position:absolute;${css}`;
      handle.dataset.gridkitHandle = dir;
      const onDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const item = this.items.find((i) => i.id === id);
        if (!item || item.locked) return;
        this.activeId = id;
        el.style.zIndex = "1000";
        el.style.willChange = "transform, width, height";
        const sx = e.clientX, sy = e.clientY, ox = item.x, oy = item.y, ow = item.w, oh = item.h;
        const mw = item.minW ?? this.opts.minItemWidth, mh = item.minH ?? this.opts.minItemHeight;
        let rafId = 0;
        this.opts.onResizeStart?.(item);
        const onMove = (ev) => {
          cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => {
            const dx = ev.clientX - sx, dy = ev.clientY - sy;
            let x = ox, y = oy, w = ow, h = oh;
            if (dir.includes("e")) w = Math.max(mw, ow + dx);
            if (dir.includes("w")) {
              w = Math.max(mw, ow - dx);
              x = ox + (ow - w);
            }
            if (dir.includes("s")) h = Math.max(mh, oh + dy);
            if (dir.includes("n")) {
              h = Math.max(mh, oh - dy);
              y = oy + (oh - h);
            }
            if (this.opts.bounds) {
              if (x < 0) {
                w += x;
                x = 0;
              }
              if (x + w > this.containerWidth) w = this.containerWidth - x;
              if (y < 0) {
                h += y;
                y = 0;
              }
              w = Math.max(w, mw);
              h = Math.max(h, mh);
            }
            el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            el.style.width = `${w}px`;
            el.style.height = `${h}px`;
            el.style.transition = "none";
            item.x = x;
            item.y = y;
            item.w = w;
            item.h = h;
            this.opts.onResize?.(item);
          });
        };
        const onUp = () => {
          cancelAnimationFrame(rafId);
          this.activeId = null;
          el.style.zIndex = "";
          el.style.willChange = "";
          if (this.opts.collision) this.items = resolveCollisions(this.items, id, this.opts.gap);
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onUp);
          this.render();
          this.opts.onResizeEnd?.(item);
          this.opts.onChange?.(this.getItems());
        };
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
      };
      handle.addEventListener("pointerdown", onDown);
      this.cleanup.push(() => handle.removeEventListener("pointerdown", onDown));
      el.appendChild(handle);
    }
  }
  static create(container, options) {
    const el = typeof container === "string" ? document.querySelector(container) : container;
    return new _GridKit({ ...options, container: el });
  }
};
// --- RESIZE ---
_GridKit.RESIZE_HANDLES = [
  { dir: "e", css: "top:0;right:0;bottom:0;width:6px;cursor:ew-resize;z-index:2" },
  { dir: "w", css: "top:0;left:0;bottom:0;width:6px;cursor:ew-resize;z-index:2" },
  { dir: "s", css: "left:0;right:0;bottom:0;height:6px;cursor:ns-resize;z-index:2" },
  { dir: "n", css: "left:0;right:0;top:0;height:6px;cursor:ns-resize;z-index:2" },
  { dir: "se", css: "right:0;bottom:0;width:14px;height:14px;cursor:nwse-resize;z-index:3" },
  { dir: "sw", css: "left:0;bottom:0;width:14px;height:14px;cursor:nesw-resize;z-index:3" },
  { dir: "ne", css: "right:0;top:0;width:14px;height:14px;cursor:nesw-resize;z-index:3" },
  { dir: "nw", css: "left:0;top:0;width:14px;height:14px;cursor:nwse-resize;z-index:3" }
];
var GridKit = _GridKit;

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
