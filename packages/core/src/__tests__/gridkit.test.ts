import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { GridKit } from '../gridkit';
import { GridKitItem } from '../types';

describe('GridKit', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    Object.defineProperty(container, 'offsetWidth', { value: 800, configurable: true });
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('create', () => {
    it('creates with element', () => {
      const grid = GridKit.create(container);
      expect(grid).toBeInstanceOf(GridKit);
      grid.destroy();
    });

    it('creates with selector', () => {
      container.id = 'test-grid';
      const grid = GridKit.create('#test-grid');
      expect(grid).toBeInstanceOf(GridKit);
      grid.destroy();
    });
  });

  describe('add', () => {
    it('adds item and renders element', () => {
      const grid = new GridKit({ container });
      grid.add({ id: 'a', x: 0, y: 0, w: 100, h: 100 });
      expect(grid.getItems()).toHaveLength(1);
      expect(container.querySelector('[data-gridkit-id="a"]')).not.toBeNull();
      grid.destroy();
    });
  });

  describe('remove', () => {
    it('removes item and element', () => {
      const grid = new GridKit({ container, items: [{ id: 'a', x: 0, y: 0, w: 100, h: 100 }] });
      grid.remove('a');
      expect(grid.getItems()).toHaveLength(0);
      expect(container.querySelector('[data-gridkit-id="a"]')).toBeNull();
      grid.destroy();
    });
  });

  describe('update', () => {
    it('updates position', () => {
      const grid = new GridKit({ container, items: [{ id: 'a', x: 0, y: 0, w: 100, h: 100 }] });
      grid.update('a', { x: 50, y: 50 });
      expect(grid.getItem('a')!.x).toBe(50);
      expect(grid.getItem('a')!.y).toBe(50);
      grid.destroy();
    });
  });

  describe('getItems', () => {
    it('returns copies', () => {
      const grid = new GridKit({ container, items: [{ id: 'a', x: 0, y: 0, w: 100, h: 100 }] });
      const items = grid.getItems();
      items[0].x = 999;
      expect(grid.getItem('a')!.x).toBe(0);
      grid.destroy();
    });
  });

  describe('getItem', () => {
    it('finds by id', () => {
      const grid = new GridKit({ container, items: [{ id: 'a', x: 10, y: 20, w: 100, h: 100 }] });
      expect(grid.getItem('a')!.x).toBe(10);
      grid.destroy();
    });
    it('returns undefined for missing id', () => {
      const grid = new GridKit({ container });
      expect(grid.getItem('missing')).toBeUndefined();
      grid.destroy();
    });
  });

  describe('toPixels/toGridUnits', () => {
    it('converts with columns mode', () => {
      const grid = new GridKit({ container, columns: 4, rowHeight: 100, gap: 0 });
      const px = grid.toPixels({ id: 'a', x: 1, y: 1, w: 2, h: 1 });
      expect(px.x).toBe(200);
      expect(px.w).toBe(400);
      expect(px.h).toBe(100);
      const units = grid.toGridUnits(px);
      expect(units.x).toBe(1);
      expect(units.w).toBe(2);
      expect(units.h).toBe(1);
      grid.destroy();
    });
    it('returns unchanged without columns', () => {
      const grid = new GridKit({ container });
      const item: GridKitItem = { id: 'a', x: 50, y: 50, w: 100, h: 100 };
      expect(grid.toPixels(item).x).toBe(50);
      expect(grid.toGridUnits(item).x).toBe(50);
      grid.destroy();
    });
  });

  describe('enableDropZone', () => {
    it('adds event listeners without error', () => {
      const grid = new GridKit({ container });
      expect(() => grid.enableDropZone()).not.toThrow();
      grid.destroy();
    });
  });

  describe('destroy', () => {
    it('cleans up elements', () => {
      const grid = new GridKit({ container, items: [{ id: 'a', x: 0, y: 0, w: 100, h: 100 }] });
      grid.destroy();
      expect(container.querySelector('[data-gridkit-id]')).toBeNull();
    });
  });

  describe('options defaults', () => {
    it('collision off by default', () => {
      const grid = new GridKit({ container, items: [
        { id: 'a', x: 0, y: 0, w: 100, h: 100 },
        { id: 'b', x: 50, y: 50, w: 100, h: 100 },
      ]});
      // With collision off, items can overlap
      const b = grid.getItem('b')!;
      expect(b.x).toBe(50);
      expect(b.y).toBe(50);
      grid.destroy();
    });
  });
});
