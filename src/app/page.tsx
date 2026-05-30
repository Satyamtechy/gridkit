import Link from "next/link";
import dynamic from "next/dynamic";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { HeroSection } from "@/components/home/hero-section";
import { BeforeAfterSection } from "@/components/home/before-after-section";
import { CodeSection } from "@/components/home/code-section";
import { FrameworksSection } from "@/components/home/frameworks-section";
import { CtaSection } from "@/components/home/cta-section";

// Lazy load heavy animated sections
const VideoSection = dynamic(() => import("@/components/home/video-section").then(m => ({ default: m.VideoSection })));
const FeaturesGrid = dynamic(() => import("@/components/home/demos/features-grid").then(m => ({ default: m.FeaturesGrid })));

export default function HomePage() {
  return (
    <div className="min-h-screen bg-void">
      <HeroSection />
      <VideoSection />
      <BeforeAfterSection />
      <FeaturesGrid />
      <CodeSection />
      <FrameworksSection />
      <CtaSection />

      <footer className="border-t border-rail px-6 py-10 text-center">
        <p className="text-sm text-fog">GridKit · MIT License · <a href="https://github.com/Satyamtechy/gridkit" className="text-frost transition-colors hover:text-electric">GitHub</a> · <a href="https://npmjs.com/package/gridkit-layout" className="text-frost transition-colors hover:text-electric">npm</a> · <Link href="/docs" className="text-frost transition-colors hover:text-electric">Docs</Link></p>
        <p className="mt-2 text-xs text-ash">Built by developers, for developers.</p>
      </footer>

      <ScrollReveal />
    </div>
  );
}
