export function BeforeAfterSection() {
  return (
    <section className="reveal px-6 py-24" data-reveal>
      <div className="mx-auto max-w-[1200px]">
        <h2 className="text-center font-display text-4xl text-frost">Before vs After</h2>
        <p className="mt-3 text-center text-fog">Replace 3 packages with one.</p>
        <div className="stagger mt-12 grid gap-6 md:grid-cols-2">
          <div className="reveal rounded-[16px] border border-danger/30 bg-surface p-8">
            <h3 className="text-lg font-semibold text-danger">Without GridKit</h3>
            <ul className="mt-4 space-y-2 text-sm text-fog">
              <li>• masonry-layout + @angular/cdk + angular2-draggable</li>
              <li>• setTimeout 2000ms hack</li>
              <li>• <code className="text-danger/80">declare var Masonry: any</code></li>
              <li>• Broken on mobile/touch</li>
              <li>• No animations</li>
            </ul>
            <div className="mt-6 rounded-lg bg-danger/5 px-4 py-2 text-xs font-medium text-danger">3 deps · 85KB · 3 days</div>
          </div>
          <div className="reveal rounded-[16px] border border-success/30 bg-surface p-8">
            <h3 className="text-lg font-semibold text-success">With GridKit</h3>
            <pre className="mt-4 overflow-x-auto rounded-lg border border-rail bg-[var(--t-code-bg)] p-4 text-xs leading-6 text-[#d4d4d4]"><code><span className="text-[#c792ea]">import</span> {"{"} GridKit {"}"} <span className="text-[#c792ea]">from</span> <span className="text-[#c3e88d]">&apos;gridkit-layout&apos;</span>{"\n\n"}GridKit.<span className="text-[#82aaff]">create</span>(<span className="text-[#c3e88d]">&apos;#el&apos;</span>, {"{"}{"\n"}  collision: <span className="text-[#ffcb6b]">true</span>,{"\n"}  animate: <span className="text-[#ffcb6b]">true</span>{"\n"}{"}"})</code></pre>
            <div className="mt-6 rounded-lg bg-success/5 px-4 py-2 text-xs font-medium text-success">0 deps · 10KB · 5 minutes</div>
          </div>
        </div>
      </div>
    </section>
  );
}
