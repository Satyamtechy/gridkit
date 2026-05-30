import Link from "next/link";

export function CtaSection() {
  return (
    <section className="reveal px-6 py-32" data-reveal>
      <div className="mx-auto max-w-[600px] text-center">
        <h2 className="font-display text-4xl text-frost">Ready to ship?</h2>
        <p className="mt-4 text-fog">Build your dashboard in minutes, not months.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/playground" className="rounded-[6px] border border-electric px-6 py-3 text-sm font-medium text-frost transition-all hover:bg-electric/10 hover:shadow-[0_0_30px_rgba(59,158,255,0.15)]">Try Playground</Link>
          <Link href="/docs" className="rounded-[6px] border border-rail px-6 py-3 text-sm text-fog transition-colors hover:border-smoke hover:text-frost">Read Docs</Link>
        </div>
      </div>
    </section>
  );
}
