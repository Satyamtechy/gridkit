const sidebarItems = [
  { id: "installation", label: "Installation" },
  { id: "quick-start", label: "Quick Start" },
  { id: "api-reference", label: "API Reference" },
  { id: "options", label: "Options" },
  { id: "events", label: "Events" },
  { id: "styling", label: "Styling" },
  { id: "frameworks", label: "Framework Guides" },
  { id: "examples", label: "Examples" },
];

export function DocsSidebar() {
  return (
    <aside className="sticky top-24 hidden h-fit w-48 shrink-0 md:block">
      <nav className="space-y-1">
        {sidebarItems.map((item) => (
          <a key={item.id} href={`#${item.id}`} className="block rounded-md px-3 py-1.5 text-sm text-fog hover:text-frost hover:bg-surface transition-colors">
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
