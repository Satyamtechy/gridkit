# gridkit-layout

Drag, resize, reorder layout engine. No dependencies. Framework-agnostic. 10KB gzipped.

[![Demo](https://img.shields.io/badge/demo-live-blue)](https://gridkit-layout.vercel.app/playground)
[![Docs](https://img.shields.io/badge/docs-website-green)](https://gridkit-layout.vercel.app/docs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 🔗 **[Live Demo](https://gridkit-layout.vercel.app/playground)** · **[Documentation](https://gridkit-layout.vercel.app/docs)** · **[Website](https://gridkit-layout.vercel.app)**

## Install

```bash
npm install gridkit-layout
```

## Quick Start

```html
<div id="grid"></div>

<script type="module">
import { GridKit } from 'gridkit-layout'

const grid = GridKit.create('#grid', {
  animate: true,
  collision: true,
  bounds: true,
})

grid.add({ id: '1', x: 0, y: 0, w: 400, h: 200, content: '<h2>Revenue</h2>' })
grid.add({ id: '2', x: 410, y: 0, w: 200, h: 200, content: '<h2>Users</h2>' })
grid.add({ id: '3', x: 0, y: 210, w: 300, h: 150, content: '<h2>Sales</h2>' })
</script>
```

## Features

- **Drag** — grab any widget, move anywhere within container bounds
- **Resize** — from all 4 edges and all 4 corners
- **Collision detection** — overlapping widgets get pushed down automatically
- **Bounds** — widgets can't overflow container width or go negative
- **Animate** — smooth CSS transitions on position/size changes
- **Minimum size** — enforced minimum width/height (default 120×80)
- **Zero dependencies** — vanilla TypeScript, no React/Vue/Angular required
- **Tiny** — ~10KB gzipped

## API

### `GridKit.create(container, options?)`

Create a new grid instance.

```ts
const grid = GridKit.create('#my-container', {
  gap: 10,               // gap between items during collision resolution
  minItemWidth: 120,     // minimum item width in px
  minItemHeight: 80,     // minimum item height in px
  collision: true,       // enable collision detection
  animate: true,         // enable CSS transitions
  animationDuration: 200,// transition duration in ms
  bounds: true,          // constrain to container width
  onChange: (items) => { /* save layout */ },
  onDragEnd: (item) => { /* item was dropped */ },
  onResizeEnd: (item) => { /* item was resized */ },
})
```

### `grid.add(item)`

Add a widget.

```ts
grid.add({
  id: 'unique-id',
  x: 100,        // left position in px
  y: 50,         // top position in px
  w: 300,        // width in px
  h: 200,        // height in px
  minW: 150,     // optional min width
  minH: 100,     // optional min height
  draggable: true,
  resizable: true,
  content: '<div>My Widget</div>', // HTML string or HTMLElement
})
```

### `grid.remove(id)`

Remove a widget.

### `grid.update(id, partial)`

Update a widget's position/size.

```ts
grid.update('1', { x: 200, y: 100, w: 500 })
```

### `grid.getItems()`

Get the current layout state (for saving/restoring).

```ts
const layout = grid.getItems()
localStorage.setItem('layout', JSON.stringify(layout))
```

### `grid.layout()`

Recalculate layout (call after container resize).

### `grid.destroy()`

Remove all event listeners and clean up.

## Events

```ts
const grid = GridKit.create('#grid', {
  onDragStart: (item) => console.log('drag started', item.id),
  onDrag: (item) => console.log('dragging', item.x, item.y),
  onDragEnd: (item) => console.log('dropped', item.id),
  onResizeStart: (item) => console.log('resize started', item.id),
  onResize: (item) => console.log('resizing', item.w, item.h),
  onResizeEnd: (item) => console.log('resize done', item.id),
  onChange: (items) => saveToBackend(items),
})
```

## Save & Restore Layout

```ts
// Save
const layout = grid.getItems()
localStorage.setItem('my-layout', JSON.stringify(layout))

// Restore
const saved = JSON.parse(localStorage.getItem('my-layout'))
const grid = GridKit.create('#grid', { items: saved })
```

## Styling

GridKit creates absolutely-positioned `<div>` elements. Style them however you want:

```css
[data-gridkit-id] {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 16px;
}
```

## Framework Usage

### React

```tsx
import { GridKit } from 'gridkit-layout'
import { useEffect, useRef } from 'react'

function Dashboard() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const grid = GridKit.create(ref.current!, {
      onChange: (items) => console.log(items),
    })
    grid.add({ id: '1', x: 0, y: 0, w: 400, h: 200, content: 'Revenue' })
    return () => grid.destroy()
  }, [])

  return <div ref={ref} style={{ width: '100%', minHeight: 600 }} />
}
```

### Angular

```ts
@Component({ template: '<div #grid></div>' })
export class DashboardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('grid') gridEl!: ElementRef
  private grid!: GridKit

  ngAfterViewInit() {
    this.grid = GridKit.create(this.gridEl.nativeElement, { collision: true })
    this.grid.add({ id: '1', x: 0, y: 0, w: 400, h: 200, content: 'Widget' })
  }

  ngOnDestroy() { this.grid.destroy() }
}
```

## License

MIT
