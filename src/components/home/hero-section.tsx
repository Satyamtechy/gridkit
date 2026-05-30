import Link from "next/link";
import { CopyCmd } from "@/components/ui/copy-cmd";
import { HeroGridAnimation } from "./hero-grid-animation";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pb-32 pt-32 md:pt-44">
      {/* Background geometric shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="anim-glow absolute left-1/2 top-1/4 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-electric/[0.04] blur-[100px]" />
        <div className="anim-float delay-3 absolute right-[10%] top-[20%] h-20 w-20 rounded-xl border border-electric/10 bg-electric/[0.02]" />
        <div className="anim-float delay-5 absolute left-[15%] top-[60%] h-14 w-14 rounded-lg border border-violet/10 bg-violet/[0.02]" />
        <div className="anim-float delay-7 absolute right-[20%] top-[70%] h-10 w-10 rounded-md border border-success/10 bg-success/[0.02]" />
      </div>

      <div className="relative mx-auto max-w-[1200px] text-center">
        <div className="anim-fade-up delay-1 flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center rounded-md overflow-hidden text-[10px] font-mono border border-rail">
            <span className="bg-surface px-2 py-1 text-fog">size</span>
            <span className="bg-electric/15 px-2 py-1 text-electric">10KB gzipped</span>
          </span>
          <span className="inline-flex items-center rounded-md overflow-hidden text-[10px] font-mono border border-rail">
            <span className="bg-surface px-2 py-1 text-fog">deps</span>
            <span className="bg-success/15 px-2 py-1 text-success">0 deps</span>
          </span>
          <span className="inline-flex items-center rounded-md overflow-hidden text-[10px] font-mono border border-rail">
            <span className="bg-surface px-2 py-1 text-fog">license</span>
            <span className="bg-violet/15 px-2 py-1 text-violet">MIT</span>
          </span>
          <a href="https://github.com/Satyamtechy/gridkit" className="inline-flex items-center rounded-md overflow-hidden text-[10px] font-mono border border-rail hover:border-smoke transition-colors">
            <span className="bg-surface px-2 py-1 text-fog">github</span>
            <span className="bg-surface px-2 py-1 text-frost flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>Star</span>
          </a>
        </div>
        <h1 className="anim-fade-up delay-2 mt-8 font-display text-[clamp(3rem,7vw,5rem)] font-normal leading-[1.05] tracking-[-0.02em] text-frost">
          The layout engine<br />for modern apps
        </h1>
        <p className="anim-fade-up delay-3 mx-auto mt-6 max-w-[560px] text-lg text-fog">
          Pixel-perfect drag, resize from any direction, collision detection. Framework-agnostic. 10KB.
        </p>
        <div className="anim-fade-up delay-4 mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/playground" className="rounded-[6px] border border-electric px-6 py-3 text-sm font-medium text-frost transition-all hover:bg-electric/10 hover:shadow-[0_0_30px_rgba(59,158,255,0.15)]">
            Try the Playground →
          </Link>
          <CopyCmd text="npm install gridkit-layout" />
        </div>

        {/* Animated grid preview */}
        <div className="anim-scale-in delay-6 mx-auto mt-20 max-w-[800px] overflow-hidden rounded-[16px] border border-rail p-8">
          <HeroGridAnimation />
        </div>
      </div>
    </section>
  );
}
