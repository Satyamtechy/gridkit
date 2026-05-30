import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { InstallSection, QuickStartSection } from "@/components/docs/install-section";
import { ApiSection } from "@/components/docs/api-section";
import { OptionsSection } from "@/components/docs/options-section";
import { EventsSection } from "@/components/docs/events-section";
import { StylingSection, FrameworksSection, ExamplesSection } from "@/components/docs/content-sections";

export default function DocsPage() {
  return (
    <div className="mx-auto flex max-w-6xl gap-12 px-6 py-12">
      <DocsSidebar />
      <main className="min-w-0 flex-1">
        <h1 className="font-display text-4xl text-frost">Documentation</h1>
        <p className="mt-4 text-fog">Everything you need to add drag, resize, and reorder to your app.</p>
        <InstallSection />
        <QuickStartSection />
        <ApiSection />
        <OptionsSection />
        <EventsSection />
        <StylingSection />
        <FrameworksSection />
        <ExamplesSection />
      </main>
    </div>
  );
}
