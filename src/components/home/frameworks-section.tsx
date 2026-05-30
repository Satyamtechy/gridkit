export function FrameworksSection() {
  return (
    <section className="reveal px-6 py-24" data-reveal>
      <div className="mx-auto max-w-[1200px] text-center">
        <h2 className="font-display text-4xl text-frost">Works everywhere</h2>
        <p className="mt-3 text-fog">Framework-agnostic core. First-class TypeScript.</p>
        <div className="stagger mt-10 flex flex-wrap justify-center gap-3">
          {["React", "Angular", "Vue", "Svelte", "Vanilla JS"].map(fw => (
            <span key={fw} className="reveal inline-block rounded-full border border-rail px-5 py-2.5 text-sm text-fog transition-colors hover:border-smoke hover:text-frost">{fw}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
