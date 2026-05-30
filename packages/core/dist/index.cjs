"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  GridHistory: () => GridHistory,
  GridKit: () => GridKit,
  KeyboardPlugin: () => KeyboardPlugin,
  NestedGridKit: () => NestedGridKit,
  clampToBounds: () => clampToBounds,
  compact: () => compact,
  computeGridLayout: () => computeGridLayout,
  computeLayout: () => computeLayout,
  createReactGridKit: () => createUseGridKit,
  createVueGridKit: () => createUseGridKit2,
  enableHistory: () => enableHistory,
  enableKeyboard: () => enableKeyboard,
  enableNestedDrag: () => enableNestedDrag,
  findCollisions: () => findCollisions,
  getSnapGuides: () => getSnapGuides,
  horizontalCompactor: () => horizontalCompactor,
  noCompactor: () => noCompactor,
  overlaps: () => overlaps,
  resolveCollisions: () => resolveCollisions,
  snapToGuides: () => snapToGuides,
  verticalCompactor: () => verticalCompactor
});
module.exports = __toCommonJS(index_exports);

// src/collision.ts
function overlaps(a, b, gap = 0) {
  return a.x < b.x + b.w + gap && a.x + a.w + gap > b.x && a.y < b.y + b.h + gap && a.y + a.h + gap > b.y;
}
function lowerBound(items, threshold) {
  let lo = 0, hi = items.length;
  while (lo < hi) {
    const mid = lo + hi >>> 1;
    if (items[mid].y < threshold) lo = mid + 1;
    else hi = mid;
  }
  return lo;
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
function findCollisions(target, items, gap = 0) {
  const sorted = [...items].sort((a, b) => a.y - b.y);
  const start = lowerBound(sorted, target.y - sorted.reduce((max, i) => Math.max(max, i.h), 0) - gap);
  const collisions = [];
  for (let i = start; i < sorted.length; i++) {
    if (sorted[i].y > target.y + target.h + gap) break;
    if (sorted[i].id !== target.id && overlaps(target, sorted[i], gap)) {
      collisions.push(sorted[i]);
    }
  }
  return collisions;
}
function clampToBounds(item, containerWidth) {
  const x = Math.max(0, Math.min(item.x, containerWidth - item.w));
  const y = Math.max(0, item.y);
  const w = Math.min(item.w, containerWidth - x);
  return { ...item, x, y, w };
}
function compact(items, gap = 0) {
  const sorted = [...items].map((i) => ({ ...i })).sort((a, b) => a.y - b.y || a.x - b.x);
  for (const item of sorted) {
    if (item.locked) continue;
    let newY = 0;
    while (newY < item.y) {
      const test = { ...item, y: newY };
      if (!sorted.some((other) => other.id !== item.id && overlaps(test, other, gap))) {
        item.y = newY;
        break;
      }
      newY++;
    }
  }
  return sorted;
}
function getSnapGuides(dragging, items, threshold = 5) {
  const guides = { x: [], y: [] };
  for (const item of items) {
    if (item.id === dragging.id) continue;
    if (Math.abs(dragging.x - item.x) <= threshold) guides.x.push(item.x);
    if (Math.abs(dragging.x + dragging.w - (item.x + item.w)) <= threshold) guides.x.push(item.x + item.w);
    if (Math.abs(dragging.x - (item.x + item.w)) <= threshold) guides.x.push(item.x + item.w);
    if (Math.abs(dragging.x + dragging.w - item.x) <= threshold) guides.x.push(item.x);
    if (Math.abs(dragging.y - item.y) <= threshold) guides.y.push(item.y);
    if (Math.abs(dragging.y + dragging.h - (item.y + item.h)) <= threshold) guides.y.push(item.y + item.h);
    if (Math.abs(dragging.y - (item.y + item.h)) <= threshold) guides.y.push(item.y + item.h);
    if (Math.abs(dragging.y + dragging.h - item.y) <= threshold) guides.y.push(item.y);
  }
  return guides;
}
function snapToGuides(item, items, threshold = 5) {
  const result = { ...item };
  for (const other of items) {
    if (other.id === item.id) continue;
    if (Math.abs(result.x - other.x) <= threshold) result.x = other.x;
    else if (Math.abs(result.x - (other.x + other.w)) <= threshold) result.x = other.x + other.w;
    else if (Math.abs(result.x + result.w - other.x) <= threshold) result.x = other.x - result.w;
    else if (Math.abs(result.x + result.w - (other.x + other.w)) <= threshold) result.x = other.x + other.w - result.w;
    if (Math.abs(result.y - other.y) <= threshold) result.y = other.y;
    else if (Math.abs(result.y - (other.y + other.h)) <= threshold) result.y = other.y + other.h;
    else if (Math.abs(result.y + result.h - other.y) <= threshold) result.y = other.y - result.h;
    else if (Math.abs(result.y + result.h - (other.y + other.h)) <= threshold) result.y = other.y + other.h - result.h;
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

// src/compaction.ts
var verticalCompactor = {
  compact(items, _cols, gap) {
    const sorted = [...items].map((i) => ({ ...i })).sort((a, b) => a.y - b.y || a.x - b.x);
    for (const item of sorted) {
      if (item.locked) continue;
      let newY = 0;
      while (newY < item.y) {
        const test = { ...item, y: newY };
        if (!sorted.some((o) => o.id !== item.id && overlaps(test, o, gap))) {
          item.y = newY;
          break;
        }
        newY++;
      }
    }
    return sorted;
  }
};
var horizontalCompactor = {
  compact(items, _cols, gap) {
    const sorted = [...items].map((i) => ({ ...i })).sort((a, b) => a.x - b.x || a.y - b.y);
    for (const item of sorted) {
      if (item.locked) continue;
      let newX = 0;
      while (newX < item.x) {
        const test = { ...item, x: newX };
        if (!sorted.some((o) => o.id !== item.id && overlaps(test, o, gap))) {
          item.x = newX;
          break;
        }
        newX++;
      }
    }
    return sorted;
  }
};
var noCompactor = {
  compact(items) {
    return items.map((i) => ({ ...i }));
  }
};

// src/history.ts
var GridHistory = class {
  constructor(maxHistory = 50) {
    this.stack = [];
    this.pointer = -1;
    this.maxHistory = maxHistory;
  }
  push(state) {
    this.stack = this.stack.slice(0, this.pointer + 1);
    this.stack.push(state.map((i) => ({ ...i })));
    if (this.stack.length > this.maxHistory) {
      this.stack.shift();
    } else {
      this.pointer++;
    }
  }
  undo() {
    if (!this.canUndo()) return null;
    this.pointer--;
    return this.stack[this.pointer].map((i) => ({ ...i }));
  }
  redo() {
    if (!this.canRedo()) return null;
    this.pointer++;
    return this.stack[this.pointer].map((i) => ({ ...i }));
  }
  canUndo() {
    return this.pointer > 0;
  }
  canRedo() {
    return this.pointer < this.stack.length - 1;
  }
  clear() {
    this.stack = [];
    this.pointer = -1;
  }
};
function enableHistory(grid, maxHistory = 50) {
  const history = new GridHistory(maxHistory);
  history.push(grid.getItems());
  const origAdd = grid.add.bind(grid);
  const origRemove = grid.remove.bind(grid);
  const origUpdate = grid.update.bind(grid);
  const origRedistribute = grid.redistribute.bind(grid);
  grid.add = (item) => {
    origAdd(item);
    history.push(grid.getItems());
  };
  grid.remove = (id) => {
    origRemove(id);
    history.push(grid.getItems());
  };
  grid.update = (id, partial) => {
    origUpdate(id, partial);
    history.push(grid.getItems());
  };
  grid.redistribute = (columns) => {
    origRedistribute(columns);
    history.push(grid.getItems());
  };
  grid.undo = () => {
    const state = history.undo();
    if (state) {
      for (const item of grid.getItems()) origRemove(item.id);
      for (const item of state) origAdd(item);
    }
  };
  grid.redo = () => {
    const state = history.redo();
    if (state) {
      for (const item of grid.getItems()) origRemove(item.id);
      for (const item of state) origAdd(item);
    }
  };
  return history;
}

// src/keyboard.ts
var FOCUS_RING = "0 0 0 2px #3b9eff";
var MOVE_PX = 10;
var KeyboardPlugin = class {
  constructor(grid, container) {
    this.focusedId = null;
    this.elements = [];
    this.cleanup = [];
    this.grid = grid;
    this.container = container;
    this.onKeyDown = this.handleKeyDown.bind(this);
    this.init();
  }
  init() {
    this.syncElements();
    this.container.addEventListener("keydown", this.onKeyDown);
    this.cleanup.push(() => this.container.removeEventListener("keydown", this.onKeyDown));
    const observer = new MutationObserver(() => this.syncElements());
    observer.observe(this.container, { childList: true });
    this.cleanup.push(() => observer.disconnect());
  }
  syncElements() {
    this.elements = Array.from(
      this.container.querySelectorAll("[data-gridkit-id]")
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
  handleKeyDown(e) {
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
    let partial = null;
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
  handleTab(e) {
    if (this.elements.length === 0) return;
    e.preventDefault();
    const currentIdx = this.elements.findIndex(
      (el) => el.dataset.gridkitId === this.focusedId
    );
    const next = e.shiftKey ? (currentIdx - 1 + this.elements.length) % this.elements.length : (currentIdx + 1) % this.elements.length;
    this.elements[next]?.focus();
  }
  deselect() {
    this.focusedId = null;
    document.activeElement?.blur?.();
  }
  destroy() {
    this.cleanup.forEach((fn) => fn());
    this.cleanup = [];
    for (const el of this.elements) {
      el.removeAttribute("tabindex");
      el.style.boxShadow = "";
    }
  }
};
function enableKeyboard(grid, container) {
  return new KeyboardPlugin(grid, container);
}

// src/nested.ts
var NestedGridKit = class {
  constructor(options) {
    this.children = /* @__PURE__ */ new Map();
    this.parent = new GridKit(options);
    for (const item of options.items ?? []) {
      if (item.subGrid) {
        this.createSubGrid(item.id, item.subGrid);
      }
    }
  }
  getParent() {
    return this.parent;
  }
  getChild(parentItemId) {
    return this.children.get(parentItemId);
  }
  createSubGrid(parentItemId, options) {
    const parentEl = this.findElement(parentItemId);
    if (!parentEl) throw new Error(`Item ${parentItemId} not found in DOM`);
    const childContainer = document.createElement("div");
    Object.assign(childContainer.style, {
      position: "absolute",
      inset: "0",
      overflow: "hidden"
    });
    parentEl.appendChild(childContainer);
    childContainer.addEventListener("pointerdown", (e) => e.stopPropagation());
    const childGrid = new GridKit({ ...options, container: childContainer });
    this.children.set(parentItemId, childGrid);
    return childGrid;
  }
  removeSubGrid(parentItemId) {
    const child = this.children.get(parentItemId);
    if (child) {
      child.destroy();
      this.children.delete(parentItemId);
    }
  }
  destroy() {
    this.children.forEach((child) => child.destroy());
    this.children.clear();
    this.parent.destroy();
  }
  findElement(itemId) {
    return this.parent["container"].querySelector(`[data-gridkit-id="${itemId}"]`);
  }
};
function enableNestedDrag(parentGrid, childGrid) {
  const parentContainer = parentGrid["container"];
  const childContainer = childGrid["container"];
  const onPointerUp = (e) => {
    const childRect = childContainer.getBoundingClientRect();
    const parentRect = parentContainer.getBoundingClientRect();
    const x = e.clientX, y = e.clientY;
    if ((x < childRect.left || x > childRect.right || y < childRect.top || y > childRect.bottom) && x >= parentRect.left && x <= parentRect.right && y >= parentRect.top && y <= parentRect.bottom) {
      const childItems = childGrid.getItems();
      const dragged = childItems.find((i) => {
        const el = childContainer.querySelector(`[data-gridkit-id="${i.id}"]`);
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

// src/vue.ts
function createUseGridKit2(vue) {
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

// src/headless.ts
function computeLayout(items, options) {
  const { containerWidth, gap = 10, columns, rowHeight, bounds = true, collision = true } = options;
  const comp = options.compactor ?? verticalCompactor;
  let resolved = items.map((i) => ({ ...i }));
  if (columns && rowHeight) {
    const colW = (containerWidth - (columns - 1) * gap) / columns;
    resolved = resolved.map((item) => ({
      ...item,
      x: item.x * (colW + gap),
      y: item.y * (rowHeight + gap),
      w: item.w * colW + (item.w - 1) * gap,
      h: item.h * rowHeight + (item.h - 1) * gap
    }));
  }
  const cols = columns ?? Math.floor((containerWidth + gap) / (100 + gap));
  resolved = comp.compact(resolved, cols, gap);
  if (collision && resolved.length > 1) {
    for (const item of resolved) {
      resolved = resolveCollisions(resolved, item.id, gap);
    }
  }
  if (bounds) {
    resolved = resolved.map((item) => ({
      ...item,
      x: Math.max(0, Math.min(item.x, containerWidth - item.w)),
      y: Math.max(0, item.y)
    }));
  }
  return resolved;
}
function computeGridLayout(items, options) {
  const { columns, gap = 0 } = options;
  const comp = options.compactor ?? verticalCompactor;
  return comp.compact(items.map((i) => ({ ...i })), columns, gap);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GridHistory,
  GridKit,
  KeyboardPlugin,
  NestedGridKit,
  clampToBounds,
  compact,
  computeGridLayout,
  computeLayout,
  createReactGridKit,
  createVueGridKit,
  enableHistory,
  enableKeyboard,
  enableNestedDrag,
  findCollisions,
  getSnapGuides,
  horizontalCompactor,
  noCompactor,
  overlaps,
  resolveCollisions,
  snapToGuides,
  verticalCompactor
});
