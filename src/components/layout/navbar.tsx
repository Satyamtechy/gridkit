"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const path = usePathname();
  const links = [
    { href: "/#features", label: "Features" },
    { href: "/playground", label: "Playground" },
    { href: "/docs", label: "Docs" },
    { href: "https://github.com/Satyamtechy/gridkit", label: "GitHub", external: true },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-rail/50 bg-void/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-frost">
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" fill="#3b9eff"/><rect x="18" y="2" width="12" height="5" rx="1.5" fill="#9281f7"/><rect x="18" y="10" width="12" height="4" rx="1.5" fill="#3ad389"/><rect x="2" y="18" width="6" height="12" rx="1.5" fill="#ffca16"/><rect x="11" y="18" width="6" height="12" rx="1.5" fill="#70b8ff"/><rect x="20" y="18" width="10" height="12" rx="2" fill="#ff9592"/></svg>
          GridKit
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map(l => (
            l.external ? (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="text-sm text-fog transition-colors hover:text-frost">{l.label}</a>
            ) : (
              <Link key={l.href} href={l.href} className={`relative text-sm transition-all duration-300 ${path === l.href || (l.href === "/#features" && path === "/") ? "text-electric" : "text-fog hover:text-frost"}`}>
                {l.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-electric transition-all duration-300 ${path === l.href || (l.href === "/#features" && path === "/") ? "w-full opacity-100" : "w-0 opacity-0"}`} />
              </Link>
            )
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/playground" className="rounded-[6px] border border-electric px-4 py-2 text-sm text-electric transition-all hover:bg-electric/10">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
