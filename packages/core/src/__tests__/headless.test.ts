import { describe, it, expect } from 'vitest';
import { computeLayout, computeGridLayout } from '../headless';
import { overlaps } from '../collision';
import { noCompactor, verticalCompactor } from '../compaction';
import { GridKitItem } from '../types';

const item = (id: string, x: number, y: number, w: number, h: number): GridKitItem =>
  ({ id, x, y, w, h });

describe('computeLayout', () => {
  it('pixel mode returns items with resolved positions', () => {
    const result = computeLayout([item('a', 0, 0, 100, 100), item('b', 200, 0, 100, 100)], { containerWidth: 800, compactor: noCompactor, collision: false });
    expect(result).toHaveLength(2);
    expect(result[0].x).toBe(0);
    expect(result[1].x).toBe(200);
  });

  it('column mode converts grid units to pixels', () => {
    const result = computeLayout([item('a', 0, 0, 2, 1)], { containerWidth: 800, columns: 4, rowHeight: 100, gap: 0, compactor: noCompactor, collision: false });
    expect(result[0].w).toBe(400);
    expect(result[0].h).toBe(100);
  });

  it('bounds clamping keeps items in container', () => {
    const result = computeLayout([item('a', 900, 0, 200, 100)], { containerWidth: 1000, bounds: true, compactor: noCompactor, collision: false });
    expect(result[0].x + result[0].w).toBeLessThanOrEqual(1000);
  });

  it('bounds off allows items outside', () => {
    const result = computeLayout([item('a', 900, -10, 200, 100)], { containerWidth: 1000, bounds: false, compactor: noCompactor, collision: false });
    expect(result[0].x).toBe(900);
    expect(result[0].y).toBe(-10);
  });

  it('compaction applied', () => {
    const result = computeLayout([item('a', 0, 100, 50, 50), item('b', 100, 200, 50, 50)], { containerWidth: 800, compactor: verticalCompactor, collision: false });
    expect(result.find(i => i.id === 'a')!.y).toBe(0);
    expect(result.find(i => i.id === 'b')!.y).toBe(0);
  });

  it('collision resolution produces no overlaps', () => {
    const result = computeLayout([item('a', 0, 0, 100, 100), item('b', 50, 50, 100, 100)], { containerWidth: 800, collision: true, compactor: noCompactor });
    for (let i = 0; i < result.length - 1; i++)
      for (let j = i + 1; j < result.length; j++)
        expect(overlaps(result[i], result[j])).toBe(false);
  });
});

describe('computeGridLayout', () => {
  it('returns grid units without pixel conversion', () => {
    const result = computeGridLayout([item('a', 0, 0, 2, 1), item('b', 2, 0, 2, 1)], { containerWidth: 800, columns: 4 });
    expect(result.find(i => i.id === 'a')!.w).toBe(2);
    expect(result.find(i => i.id === 'b')!.w).toBe(2);
  });

  it('applies compaction in grid units', () => {
    const result = computeGridLayout([item('a', 0, 5, 2, 1), item('b', 5, 10, 2, 1)], { containerWidth: 800, columns: 12 });
    expect(result.find(i => i.id === 'a')!.y).toBe(0);
    expect(result.find(i => i.id === 'b')!.y).toBe(0);
  });
});
