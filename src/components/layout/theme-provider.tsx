"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";
type Mode = "auto" | "light" | "dark";

const ThemeCtx = createContext<{ theme: Theme; mode: Mode; toggle: () => void }>({
  theme: "dark", mode: "auto", toggle: () => {},
});

export function useTheme() { return useContext(ThemeCtx); }

function getTimeTheme(): Theme {
  const h = new Date().getHours();
  return h >= 6 && h < 18 ? "light" : "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("auto");
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("gridkit-theme") as Mode | null;
    const m = saved ?? "auto";
    setMode(m);
    setTheme(m === "auto" ? getTimeTheme() : m);
  }, []);

  useEffect(() => {
    if (mode !== "auto") return;
    const id = setInterval(() => setTheme(getTimeTheme()), 60_000);
    return () => clearInterval(id);
  }, [mode]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setMode(prev => {
      const next: Mode = prev === "auto" ? (theme === "dark" ? "light" : "dark") : prev === "dark" ? "light" : "auto";
      localStorage.setItem("gridkit-theme", next);
      const resolved = next === "auto" ? getTimeTheme() : next;
      setTheme(resolved);
      return next;
    });
  }, [theme]);

  return <ThemeCtx.Provider value={{ theme, mode, toggle }}>{children}</ThemeCtx.Provider>;
}
