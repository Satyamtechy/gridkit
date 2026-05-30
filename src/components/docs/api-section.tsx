import { CodeBlock } from "@/components/ui/code-block";

const methods = [
  { name: "GridKit.create(el, options?)", desc: "Creates a new GridKit instance. Accepts a selector string or HTMLElement.", code: `const grid = GridKit.create('#container', { collision: true })` },
  { name: "grid.add(item)", desc: "Adds an item to the grid. Returns the created grid item.", code: `grid.add({
  id: 'unique-id',
  x: 0, y: 0,        // position in pixels
  w: 300, h: 200,    // size in pixels
  content: element,   // HTMLElement to render
  minW: 100,         // optional min width
  minH: 80,          // optional min height
  maxW: 600,         // optional max width
  maxH: 400,         // optional max height
  draggable: true,   // default: true
  resizable: true    // default: true
})` },
  { name: "grid.remove(id)", desc: "Removes an item by ID.", code: `grid.remove('widget-1')` },
  { name: "grid.update(id, props)", desc: "Updates item properties (position, size, constraints).", code: `grid.update('widget-1', { x: 100, y: 50, w: 500 })` },
  { name: "grid.getItems()", desc: "Returns all items with their current positions and sizes.", code: `const items = grid.getItems()\n// [{ id, x, y, w, h, ... }]` },
  { name: "grid.layout()", desc: "Forces a layout recalculation. Useful after container resize.", code: `window.addEventListener('resize', () => grid.layout())` },
  { name: "grid.destroy()", desc: "Removes all event listeners and cleans up. Call on unmount.", code: `grid.destroy()` },
];

export function ApiSection() {
  return (
    <section id="api-reference" className="mt-16">
      <h2 className="text-2xl font-semibold text-frost">API Reference</h2>
      <div className="mt-8 space-y-8">
        {methods.map(m => (
          <div key={m.name}>
            <h3 className="font-mono text-lg text-electric">{m.name}</h3>
            <p className="mt-2 text-sm text-fog">{m.desc}</p>
            <CodeBlock>{m.code}</CodeBlock>
          </div>
        ))}
      </div>
    </section>
  );
}
