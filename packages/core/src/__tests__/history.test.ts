import { describe, it, expect } from 'vitest';
import { GridHistory } from '../history';
import { GridKitItem } from '../types';

const state = (ids: string[]): GridKitItem[] =>
  ids.map(id => ({ id, x: 0, y: 0, w: 50, h: 50 }));

describe('GridHistory', () => {
  it('pushes states', () => {
    const h = new GridHistory();
    h.push(state(['a']));
    h.push(state(['a', 'b']));
    expect(h.canUndo()).toBe(true);
  });

  it('undo returns previous state', () => {
    const h = new GridHistory();
    h.push(state(['a']));
    h.push(state(['a', 'b']));
    const prev = h.undo();
    expect(prev).toHaveLength(1);
    expect(prev![0].id).toBe('a');
  });

  it('redo returns next state', () => {
    const h = new GridHistory();
    h.push(state(['a']));
    h.push(state(['a', 'b']));
    h.undo();
    const next = h.redo();
    expect(next).toHaveLength(2);
  });

  it('canUndo is false with single state', () => {
    const h = new GridHistory();
    h.push(state(['a']));
    expect(h.canUndo()).toBe(false);
  });

  it('canRedo is false when at latest', () => {
    const h = new GridHistory();
    h.push(state(['a']));
    h.push(state(['b']));
    expect(h.canRedo()).toBe(false);
  });

  it('canRedo is true after undo', () => {
    const h = new GridHistory();
    h.push(state(['a']));
    h.push(state(['b']));
    h.undo();
    expect(h.canRedo()).toBe(true);
  });

  it('clear resets history', () => {
    const h = new GridHistory();
    h.push(state(['a']));
    h.push(state(['b']));
    h.clear();
    expect(h.canUndo()).toBe(false);
    expect(h.canRedo()).toBe(false);
  });

  it('respects maxHistory limit', () => {
    const h = new GridHistory(3);
    h.push(state(['1']));
    h.push(state(['2']));
    h.push(state(['3']));
    h.push(state(['4']));
    expect(h.undo()).not.toBeNull();
    expect(h.undo()).not.toBeNull();
    expect(h.canUndo()).toBe(false);
  });

  it('discards redo on new push', () => {
    const h = new GridHistory();
    h.push(state(['a']));
    h.push(state(['b']));
    h.push(state(['c']));
    h.undo();
    h.undo();
    h.push(state(['d']));
    expect(h.canRedo()).toBe(false);
  });

  it('undo returns null when cannot undo', () => {
    expect(new GridHistory().undo()).toBeNull();
  });

  it('redo returns null when cannot redo', () => {
    const h = new GridHistory();
    h.push(state(['a']));
    expect(h.redo()).toBeNull();
  });
});
