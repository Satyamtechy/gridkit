const events = [
  { name: "onDragStart", args: "(item, event)", desc: "Fired when dragging begins" },
  { name: "onDrag", args: "(item, event)", desc: "Fired continuously during drag" },
  { name: "onDragEnd", args: "(item, event)", desc: "Fired when dragging ends" },
  { name: "onResizeStart", args: "(item, edge, event)", desc: "Fired when resizing begins" },
  { name: "onResize", args: "(item, edge, event)", desc: "Fired continuously during resize" },
  { name: "onResizeEnd", args: "(item, edge, event)", desc: "Fired when resizing ends" },
  { name: "onChange", args: "(items)", desc: "Fired after any layout change" },
];

export function EventsSection() {
  return (
    <section id="events" className="mt-16">
      <h2 className="text-2xl font-semibold text-frost">Events</h2>
      <p className="mt-4 text-sm text-fog">Subscribe via options callbacks.</p>
      <div className="mt-6 space-y-4">
        {events.map(e => (
          <div key={e.name} className="flex items-baseline gap-4 border-b border-rail/50 pb-4">
            <span className="font-mono text-sm text-electric">{e.name}</span>
            <span className="font-mono text-xs text-ash">{e.args}</span>
            <span className="text-sm text-fog">{e.desc}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
