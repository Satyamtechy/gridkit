"use client";

import { useState } from "react";

interface CodeBlockProps {
  children: string;
  label?: string;
}

export function CodeBlock({ children, label }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="group relative mt-4 overflow-x-auto rounded-[16px] border border-rail bg-[var(--t-code-bg)] transition-colors hover:border-smoke">
      {label && <div className="border-b border-[#333] px-5 py-2 text-xs text-[#888]">{label}</div>}
      <pre className="p-5 font-mono text-sm leading-7 text-[#c9ccd1]"><code>{children}</code></pre>
      <button
        onClick={() => { navigator.clipboard.writeText(children); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        className="absolute right-3 top-3 flex cursor-pointer items-center gap-1.5 rounded-md border border-[#333] bg-[#1a1d24] px-2.5 py-1.5 text-[10px] text-[#888] opacity-0 transition-all hover:border-[#555] hover:text-white group-hover:opacity-100"
      >
        {copied ? (
          <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-[#3ad389]"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Copied</>
        ) : (
          <><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2"/></svg>Copy</>
        )}
      </button>
    </div>
  );
}
