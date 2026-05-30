"use client";

import { DragDemo } from "./drag-demo";
import { ResizeDemo } from "./resize-demo";
import { CollisionDemo } from "./collision-demo";
import { ResponsiveDemo } from "./responsive-demo";
import { DropzoneDemo } from "./dropzone-demo";
import { UndoDemo } from "./undo-demo";
import { KeyboardDemo } from "./keyboard-demo";
import { NestedDemo } from "./nested-demo";
import { HeadlessDemo } from "./headless-demo";

interface Feature {
  title: string;
  desc: string;
  Demo: React.ComponentType;
  accent: string;
}

const FEATURES: Feature[] = [
  { title: "Freeform Drag", desc: "Pixel-level precision. Smooth 60fps pointer tracking.", Demo: DragDemo, accent: "electric" },
  { title: "8-Handle Resize", desc: "All edges and corners. Min/max constraints enforced.", Demo: ResizeDemo, accent: "violet" },
  { title: "Collision Detection", desc: "Overlapping widgets auto-push. O(n log n) sweep-line.", Demo: CollisionDemo, accent: "success" },
  { title: "Responsive Breakpoints", desc: "Auto-switch layouts by container width. Like CSS but smarter.", Demo: ResponsiveDemo, accent: "electric" },
  { title: "Drag From Outside", desc: "Drop widgets from a sidebar or toolbox into the grid.", Demo: DropzoneDemo, accent: "warning" },
  { title: "Undo / Redo", desc: "Full history stack. Ctrl+Z friendly. 50-state memory.", Demo: UndoDemo, accent: "info" },
  { title: "Keyboard Navigation", desc: "Tab to focus, arrows to move, Shift+arrows to resize.", Demo: KeyboardDemo, accent: "electric" },
  { title: "Nested Grids", desc: "Grids inside grids. Isolated events. Cross-grid drag.", Demo: NestedDemo, accent: "violet" },
  { title: "SSR / Headless", desc: "Compute layouts server-side. Zero DOM. Pure functions.", Demo: HeadlessDemo, accent: "success" },
];

const ACCENT_MAP: Record<string, string> = {
  electric: "text-electric",
  violet: "text-violet",
  success: "text-success",
  warning: "text-warning",
  info: "text-info",
};

export function FeaturesGrid() {
  return (
    <section className="px-6 py-24" id="features" data-reveal>
      <div className="mx-auto max-w-[1200px]">
        <div className="reveal text-center">
          <h2 className="font-display text-4xl text-frost">Everything. Built in.</h2>
          <p className="mt-3 text-fog">Every feature runs live below — no static screenshots.</p>
        </div>
        <div className="stagger mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ title, desc, Demo, accent }) => (
            <div key={title} className="reveal group rounded-[16px] border border-rail bg-surface p-5 transition-colors hover:border-smoke">
              <Demo />
              <h3 className={`mt-4 text-sm font-semibold ${ACCENT_MAP[accent]}`}>{title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-fog">{desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom row: framework support + stats */}
        <div className="reveal mt-5 grid gap-5 sm:grid-cols-3">
          <div className="rounded-[16px] border border-rail bg-surface p-5">
            <div className="flex gap-2">
              {["React", "Vue", "Svelte", "Angular", "Vanilla"].map(fw => (
                <span key={fw} className="rounded border border-rail px-2 py-1 text-[9px] text-fog">{fw}</span>
              ))}
            </div>
            <h3 className="mt-3 text-sm font-semibold text-frost">Framework Agnostic</h3>
            <p className="mt-1 text-xs text-fog">Core works everywhere. React & Vue hooks included.</p>
          </div>
          <div className="rounded-[16px] border border-rail bg-surface p-5">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-semibold text-electric">10</span>
              <span className="text-sm text-fog">KB gzipped</span>
            </div>
            <h3 className="mt-2 text-sm font-semibold text-frost">Tiny Bundle</h3>
            <p className="mt-1 text-xs text-fog">Tree-shakeable. Import only what you use.</p>
          </div>
          <div className="rounded-[16px] border border-rail bg-surface p-5">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-semibold text-success">0</span>
              <span className="text-sm text-fog">dependencies</span>
            </div>
            <h3 className="mt-2 text-sm font-semibold text-frost">Zero Deps</h3>
            <p className="mt-1 text-xs text-fog">Pure TypeScript. No jQuery, no runtime bloat.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
