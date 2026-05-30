import { describe, it, expect } from 'vitest';
import { overlaps, resolveCollisions, findCollisions, clampToBounds, compact, getSnapGuides, snapToGuides } from '../collision';
import { GridKitItem } from '../types';

const item = (id: string, x: number, y: number, w: number, h: number, extra?: Partial<GridKitItem>): GridKitItem =>
  ({ id, x, y, w, h, ...extra });

describe('overlaps', () => {
  it('detects overlapping items', () => {
    expect(overlaps(item('a', 0, 0, 100, 100), item('b', 50, 50, 100, 100))).toBe(true);
  });
  it('returns false for non-overlapping', () => {
    expect(overlaps(item('a', 0, 0, 50, 50), item('b', 100, 100, 50, 50))).toBe(false);
  });
  it('returns false for edge-touching (no gap)', () => {
    expect(overlaps(item('a', 0, 0, 50, 50), item('b', 50, 0, 50, 50))).toBe(false);
  });
  it('detects overlap with gap', () => {
    expect(overlaps(item('a', 0, 0, 50, 50), item('b', 50, 0, 50, 50), 5)).toBe(true);
  });
  it('no overlap with gap when far apart', () => {
    expect(overlaps(item('a', 0, 0, 50, 50), item('b', 60, 0, 50, 50), 5)).toBe(false);
  });
});

describe('resolveCollisions', () => {
  it('pushes colliding item down', () => {
    const items = [item('a', 0, 0, 100, 100), item('b', 50, 50, 100, 100)];
    const result = resolveCollisions(items, 'a');
    expect(result.find(i => i.id === 'b')!.y).toBeGreaterThanOrEqual(100);
  });
  it('handles cascading collisions', () => {
    const items = [item('a', 0, 0, 100, 50), item('b', 0, 30, 100, 50), item('c', 0, 60, 100, 50)];
    const result = resolveCollisions(items, 'a');
    for (let i = 0; i < result.length - 1; i++)
      for (let j = i + 1; j < result.length; j++)
        expect(overlaps(result[i], result[j])).toBe(false);
  });
  it('ignores locked items', () => {
    const items = [item('a', 0, 0, 100, 100), item('b', 50, 50, 100, 100, { locked: true })];
    const result = resolveCollisions(items, 'a');
    expect(result.find(i => i.id === 'b')!.y).toBe(50);
  });
  it('respects gap', () => {
    const items = [item('a', 0, 0, 100, 100), item('b', 0, 90, 100, 100)];
    const result = resolveCollisions(items, 'a', 10);
    expect(result.find(i => i.id === 'b')!.y).toBeGreaterThanOrEqual(110);
  });
  it('does not move the moved item', () => {
    const items = [item('a', 0, 0, 100, 100), item('b', 50, 50, 100, 100)];
    const result = resolveCollisions(items, 'a');
    const a = result.find(i => i.id === 'a')!;
    expect(a.x).toBe(0);
    expect(a.y).toBe(0);
  });
});

describe('findCollisions', () => {
  it('finds all colliders', () => {
    const target = item('a', 0, 0, 100, 100);
    const others = [item('b', 50, 50, 50, 50), item('c', 200, 200, 50, 50), item('d', 80, 0, 50, 50)];
    const result = findCollisions(target, others);
    expect(result.map(r => r.id).sort()).toEqual(['b', 'd']);
  });
  it('returns empty for no collisions', () => {
    const target = item('a', 0, 0, 50, 50);
    expect(findCollisions(target, [item('b', 100, 100, 50, 50)])).toHaveLength(0);
  });
});

describe('clampToBounds', () => {
  it('clamps x to container', () => {
    expect(clampToBounds(item('a', 900, 0, 200, 100), 1000).x).toBe(800);
  });
  it('clamps negative x to 0', () => {
    expect(clampToBounds(item('a', -50, 0, 100, 100), 1000).x).toBe(0);
  });
  it('clamps w to fit', () => {
    const r = clampToBounds(item('a', 900, 0, 200, 100), 1000);
    expect(r.x + r.w).toBeLessThanOrEqual(1000);
  });
  it('clamps negative y to 0', () => {
    expect(clampToBounds(item('a', 0, -10, 100, 100), 1000).y).toBe(0);
  });
  it('leaves valid item unchanged', () => {
    const r = clampToBounds(item('a', 50, 50, 100, 100), 1000);
    expect(r.x).toBe(50);
    expect(r.y).toBe(50);
    expect(r.w).toBe(100);
  });
});

describe('compact', () => {
  it('moves items up', () => {
    const result = compact([item('a', 0, 100, 50, 50), item('b', 100, 200, 50, 50)]);
    expect(result.every(i => i.y < 100)).toBe(true);
  });
  it('respects locked items', () => {
    expect(compact([item('a', 0, 100, 50, 50, { locked: true })])[0].y).toBe(100);
  });
  it('no overlaps after compaction', () => {
    const result = compact([item('a', 0, 50, 100, 50), item('b', 0, 200, 100, 50)]);
    for (let i = 0; i < result.length - 1; i++)
      for (let j = i + 1; j < result.length; j++)
        expect(overlaps(result[i], result[j])).toBe(false);
  });
});

describe('getSnapGuides', () => {
  it('finds x guides within threshold', () => {
    const guides = getSnapGuides(item('a', 102, 0, 50, 50), [item('b', 100, 100, 50, 50)], 5);
    expect(guides.x).toContain(100);
  });
  it('finds y guides within threshold', () => {
    const guides = getSnapGuides(item('a', 0, 98, 50, 50), [item('b', 200, 100, 50, 50)], 5);
    expect(guides.y).toContain(100);
  });
});

describe('snapToGuides', () => {
  it('snaps x position', () => {
    expect(snapToGuides(item('a', 102, 0, 50, 50), [item('b', 100, 200, 50, 50)], 5).x).toBe(100);
  });
  it('snaps y position', () => {
    expect(snapToGuides(item('a', 0, 98, 50, 50), [item('b', 200, 100, 50, 50)], 5).y).toBe(100);
  });
});
