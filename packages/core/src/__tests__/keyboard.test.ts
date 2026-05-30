import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { KeyboardPlugin } from '../keyboard';
import { GridKit } from '../gridkit';

describe('KeyboardPlugin', () => {
  let container: HTMLElement;
  let grid: GridKit;

  beforeEach(() => {
    container = document.createElement('div');
    Object.defineProperty(container, 'offsetWidth', { value: 800, configurable: true });
    document.body.appendChild(container);
    grid = new GridKit({ container, items: [{ id: 'item1', x: 0, y: 0, w: 100, h: 100 }] });
  });

  afterEach(() => {
    grid.destroy();
    document.body.removeChild(container);
  });

  it('creates plugin with container', () => {
    const plugin = new KeyboardPlugin(grid, container);
    expect(plugin).toBeDefined();
    plugin.destroy();
  });

  it('adds tabindex to grid items', () => {
    const plugin = new KeyboardPlugin(grid, container);
    const el = container.querySelector('[data-gridkit-id]') as HTMLElement;
    expect(el?.getAttribute('tabindex')).toBe('0');
    plugin.destroy();
  });

  it('destroy cleans up tabindex', () => {
    const plugin = new KeyboardPlugin(grid, container);
    plugin.destroy();
    const el = container.querySelector('[data-gridkit-id]') as HTMLElement;
    expect(el?.getAttribute('tabindex')).toBeNull();
  });
});
