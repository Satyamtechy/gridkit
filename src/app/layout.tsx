import type { Metadata } from "next";
import { Inter, DM_Serif_Display, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GridKit — Drag, Resize, Reorder Layout Engine",
  description:
    "Pixel-perfect drag, resize from any direction, collision detection. Framework-agnostic layout engine. Zero dependencies. 10KB gzipped. Works with React, Angular, Vue, Svelte, and Vanilla JS.",
  keywords: [
    "grid layout",
    "drag and drop",
    "resize",
    "collision detection",
    "layout engine",
    "dashboard",
    "framework agnostic",
    "typescript",
    "javascript",
  ],
  openGraph: {
    title: "GridKit — Drag, Resize, Reorder Layout Engine",
    description:
      "Pixel-perfect drag, resize from any direction, collision detection. Framework-agnostic. Zero dependencies. 10KB.",
    type: "website",
    url: "https://gridkit.dev",
    siteName: "GridKit",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "GridKit Layout Engine" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GridKit — Drag, Resize, Reorder Layout Engine",
    description:
      "Pixel-perfect drag, resize from any direction, collision detection. Framework-agnostic. Zero dependencies. 10KB.",
    images: ["/og-image.png"],
  },
  metadataBase: new URL("https://gridkit.dev"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSerif.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
