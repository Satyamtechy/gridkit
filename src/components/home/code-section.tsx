export function CodeSection() {
  return (
    <section className="reveal px-6 py-24" data-reveal>
      <div className="mx-auto max-w-[700px]">
        <h2 className="text-center font-display text-4xl text-frost">Simple API</h2>
        <p className="mt-3 text-center text-fog">Three lines to a working layout.</p>
        <pre className="mt-10 overflow-x-auto rounded-[16px] border border-rail bg-[var(--t-code-bg)] p-6 font-mono text-[13px] leading-7 text-[#d4d4d4] transition-colors hover:border-electric/30">
          <code><span className="text-[#c792ea]">import</span> {"{"} GridKit {"}"} <span className="text-[#c792ea]">from</span> <span className="text-[#c3e88d]">&apos;gridkit-layout&apos;</span>{"\n\n"}<span className="text-[#8a919c]">const grid = GridKit.</span><span className="text-[#82aaff]">create</span>(<span className="text-[#c3e88d]">&apos;#dashboard&apos;</span>, {"{"}{"\n"}{"  "}collision: <span className="text-[#ffcb6b]">true</span>,{"\n"}{"  "}animate: <span className="text-[#ffcb6b]">true</span>,{"\n"}{"  "}onChange: (items) {"=>"} <span className="text-[#82aaff]">saveLayout</span>(items){"\n"}{"}"}){"\n\n"}grid.<span className="text-[#82aaff]">add</span>({"{"} id: <span className="text-[#c3e88d]">&apos;1&apos;</span>, x: <span className="text-[#ffcb6b]">0</span>, y: <span className="text-[#ffcb6b]">0</span>, w: <span className="text-[#ffcb6b]">400</span>, h: <span className="text-[#ffcb6b]">200</span> {"}"}){"\n"}grid.<span className="text-[#82aaff]">add</span>({"{"} id: <span className="text-[#c3e88d]">&apos;2&apos;</span>, x: <span className="text-[#ffcb6b]">410</span>, y: <span className="text-[#ffcb6b]">0</span>, w: <span className="text-[#ffcb6b]">200</span>, h: <span className="text-[#ffcb6b]">200</span> {"}"})</code>
        </pre>
      </div>
    </section>
  );
}
