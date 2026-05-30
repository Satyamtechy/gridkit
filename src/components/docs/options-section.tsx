const options = [
  { name: "collision", type: "boolean", def: "false", desc: "Enable collision detection and auto-push" },
  { name: "animate", type: "boolean", def: "false", desc: "Animate item transitions" },
  { name: "bounds", type: "boolean", def: "false", desc: "Constrain items within container" },
  { name: "gap", type: "number", def: "0", desc: "Gap between items in pixels" },
  { name: "padding", type: "number", def: "0", desc: "Container inner padding" },
  { name: "resizeHandles", type: "'all' | Direction[]", def: "'all'", desc: "Which handles to show" },
  { name: "onChange", type: "(items) => void", def: "undefined", desc: "Called when any item changes position/size" },
];

export function OptionsSection() {
  return (
    <section id="options" className="mt-16">
      <h2 className="text-2xl font-semibold text-frost">Options</h2>
      <p className="mt-4 text-sm text-fog">Pass to GridKit.create() as the second argument. All features are opt-in.</p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rail text-left">
              <th className="pb-3 pr-6 text-frost">Option</th>
              <th className="pb-3 pr-6 text-frost">Type</th>
              <th className="pb-3 pr-6 text-frost">Default</th>
              <th className="pb-3 text-frost">Description</th>
            </tr>
          </thead>
          <tbody className="text-fog">
            {options.map((o, i) => (
              <tr key={o.name} className={i < options.length - 1 ? "border-b border-rail/50" : ""}>
                <td className="py-3 pr-6 font-mono text-electric">{o.name}</td>
                <td className="py-3 pr-6">{o.type}</td>
                <td className="py-3 pr-6">{o.def}</td>
                <td className="py-3">{o.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
