import { describe, it, expect } from 'vitest';
import { verticalCompactor, horizontalCompactor, noCompactor } from '../compaction';
import { overlaps } from '../collision';
import { GridKitItem } from '../types';

const item = (id: string, x: number, y: number, w: number, h: number, extra?: Partial<GridKitItem>): GridKitItem =>
  ({ id, x, y, w, h, ...extra });

describe('verticalCompactor', () => {
  it('moves items up to fill gaps', () => {
    const result = verticalCompactor.compact([item('a', 0, 100, 50, 50), item('b', 100, 200, 50, 50)], 12, 0);
    expect(result.find(i => i.id === 'a')!.y).toBe(0);
    expect(result.find(i => i.id === 'b')!.y).toBe(0);
  });
  it('produces no overlaps', () => {
    const result = verticalCompactor.compact([item('a', 0, 50, 100, 50), item('b', 0, 200, 100, 50)], 12, 0);
    for (let i = 0; i < result.length - 1; i++)
      for (let j = i + 1; j < result.length; j++)
        expect(overlaps(result[i], result[j])).toBe(false);
  });
  it('respects locked items', () => {
    const result = verticalCompactor.compact([item('a', 0, 100, 50, 50, { locked: true })], 12, 0);
    expect(result[0].y).toBe(100);
  });
  it('respects gap', () => {
    const result = verticalCompactor.compact([item('a', 0, 0, 50, 50), item('b', 0, 200, 50, 50)], 12, 10);
    expect(result.find(i => i.id === 'b')!.y).toBeGreaterThanOrEqual(60);
  });
});

describe('horizontalCompactor', () => {
  it('moves items left to fill gaps', () => {
    const result = horizontalCompactor.compact([item('a', 200, 0, 50, 50), item('b', 100, 100, 50, 50)], 12, 0);
    expect(result.find(i => i.id === 'b')!.x).toBe(0);
    expect(result.find(i => i.id === 'a')!.x).toBe(0);
  });
  it('produces no overlaps for non-vertically-overlapping items', () => {
    const result = horizontalCompactor.compact([item('a', 200, 0, 100, 50), item('b', 300, 100, 100, 50)], 12, 0);
    for (let i = 0; i < result.length - 1; i++)
      for (let j = i + 1; j < result.length; j++)
        expect(overlaps(result[i], result[j])).toBe(false);
  });
  it('respects locked items', () => {
    const result = horizontalCompactor.compact([item('a', 200, 0, 50, 50, { locked: true })], 12, 0);
    expect(result[0].x).toBe(200);
  });
});

describe('noCompactor', () => {
  it('returns items unchanged', () => {
    const result = noCompactor.compact([item('a', 100, 200, 50, 50), item('b', 300, 400, 80, 60)], 12, 0);
    expect(result[0]).toMatchObject({ x: 100, y: 200 });
    expect(result[1]).toMatchObject({ x: 300, y: 400 });
  });
  it('returns copies not references', () => {
    const items = [item('a', 0, 0, 50, 50)];
    const result = noCompactor.compact(items, 12, 0);
    result[0].x = 999;
    expect(items[0].x).toBe(0);
  });
});
