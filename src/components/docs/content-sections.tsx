import { CodeBlock } from "@/components/ui/code-block";

export function StylingSection() {
  return (
    <section id="styling" className="mt-16">
      <h2 className="text-2xl font-semibold text-frost">Styling</h2>
      <p className="mt-4 text-sm text-fog">GridKit applies minimal styles. Target items with data attributes.</p>
      <CodeBlock>{`/* Target any grid item */
[data-gridkit-id] {
  border-radius: 8px;
  background: #1a1a2e;
  border: 1px solid #292d30;
}

/* Style resize handles */
[data-gridkit-handle] {
  opacity: 0;
  transition: opacity 0.2s;
}
[data-gridkit-id]:hover [data-gridkit-handle] {
  opacity: 1;
}

/* Style drag zone */
[data-gridkit-drag] {
  cursor: grab;
}`}</CodeBlock>
    </section>
  );
}

export function FrameworksSection() {
  return (
    <section id="frameworks" className="mt-16">
      <h2 className="text-2xl font-semibold text-frost">Framework Guides</h2>

      <h3 className="mt-8 text-lg font-semibold text-frost">React</h3>
      <CodeBlock>{`import { useRef, useEffect } from 'react'
import { GridKit } from 'gridkit-layout'

function Dashboard() {
  const containerRef = useRef(null)

  useEffect(() => {
    const grid = GridKit.create(containerRef.current, {
      collision: true,
      animate: true
    })
    grid.add({ id: '1', x: 0, y: 0, w: 300, h: 200 })
    return () => grid.destroy()
  }, [])

  return <div ref={containerRef} style={{ width: '100%', height: '600px' }} />
}`}</CodeBlock>

      <h3 className="mt-8 text-lg font-semibold text-frost">Angular</h3>
      <CodeBlock>{`import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core'
import { GridKit } from 'gridkit-layout'

@Component({
  selector: 'app-dashboard',
  template: '<div #container style="width:100%;height:600px"></div>'
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container') container!: ElementRef
  private grid!: ReturnType<typeof GridKit.create>

  ngAfterViewInit() {
    this.grid = GridKit.create(this.container.nativeElement, { collision: true, animate: true })
    this.grid.add({ id: '1', x: 0, y: 0, w: 300, h: 200 })
  }

  ngOnDestroy() { this.grid.destroy() }
}`}</CodeBlock>

      <h3 className="mt-8 text-lg font-semibold text-frost">Vue</h3>
      <CodeBlock>{`<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { GridKit } from 'gridkit-layout'

const container = ref(null)
let grid

onMounted(() => {
  grid = GridKit.create(container.value, { collision: true, animate: true })
  grid.add({ id: '1', x: 0, y: 0, w: 300, h: 200 })
})

onUnmounted(() => grid?.destroy())
</script>

<template>
  <div ref="container" style="width:100%;height:600px" />
</template>`}</CodeBlock>
    </section>
  );
}

export function ExamplesSection() {
  return (
    <section id="examples" className="mt-16 pb-24">
      <h2 className="text-2xl font-semibold text-frost">Examples</h2>

      <h3 className="mt-8 text-lg font-semibold text-frost">Save &amp; Restore Layout</h3>
      <CodeBlock>{`const grid = GridKit.create('#app', {
  onChange: (items) => {
    localStorage.setItem('layout', JSON.stringify(items))
  }
})

// Restore on load
const saved = JSON.parse(localStorage.getItem('layout') || '[]')
saved.forEach(item => grid.add(item))`}</CodeBlock>

      <h3 className="mt-8 text-lg font-semibold text-frost">Dynamic Add/Remove</h3>
      <CodeBlock>{`document.getElementById('add-btn').onclick = () => {
  grid.add({
    id: crypto.randomUUID(),
    x: 0, y: 0,
    w: 200, h: 150,
    content: createWidgetElement()
  })
}

document.getElementById('remove-btn').onclick = () => {
  const items = grid.getItems()
  if (items.length) grid.remove(items[items.length - 1].id)
}`}</CodeBlock>
    </section>
  );
}
