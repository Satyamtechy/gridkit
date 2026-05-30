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
        <Link href="/" className="text-lg font-semibold text-frost">GridKit</Link>
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
