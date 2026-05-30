"use client";

import { useState } from "react";

interface CopyCmdProps {
  text: string;
  display?: string;
}

export function CopyCmd({ text, display }: CopyCmdProps) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="group flex cursor-pointer items-center gap-3 rounded-[16px] border border-rail bg-void px-5 py-3 font-mono text-sm text-fog transition-colors hover:border-smoke active:scale-[0.98]"
    >
      <span dangerouslySetInnerHTML={{ __html: display ?? `npm install <span class="text-electric">gridkit-layout</span>` }} />
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-success flex-shrink-0"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-ash flex-shrink-0 transition-colors group-hover:text-fog"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2"/></svg>
      )}
    </button>
  );
}
