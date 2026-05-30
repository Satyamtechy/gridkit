import { CodeBlock } from "@/components/ui/code-block";

export function InstallSection() {
  return (
    <section id="installation" className="mt-16">
      <h2 className="text-2xl font-semibold text-frost">Installation</h2>
      <CodeBlock>{`npm install gridkit-layout`}</CodeBlock>
      <p className="mt-4 text-sm text-fog">Or with yarn/pnpm:</p>
      <CodeBlock>{`yarn add gridkit-layout\npnpm add gridkit-layout`}</CodeBlock>
    </section>
  );
}

export function QuickStartSection() {
  return (
    <section id="quick-start" className="mt-16">
      <h2 className="text-2xl font-semibold text-frost">Quick Start</h2>
      <p className="mt-4 text-sm text-fog">Create a grid, add items, and you&apos;re done.</p>
      <CodeBlock>{`import { GridKit } from 'gridkit-layout'

// Create a grid inside a container element
const grid = GridKit.create('#dashboard', {
  collision: true,
  animate: true,
  bounds: true
})

// Add items
grid.add({
  id: 'widget-1',
  x: 0,
  y: 0,
  w: 400,
  h: 200,
  content: document.getElementById('my-widget')
})

// Listen for changes
grid.on('change', (items) => {
  localStorage.setItem('layout', JSON.stringify(items))
})`}</CodeBlock>
    </section>
  );
}
