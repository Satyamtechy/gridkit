"use client";

import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    const o = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); o.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -80px 0px" });
    document.querySelectorAll(".reveal").forEach(el => o.observe(el));
    return () => o.disconnect();
  }, []);
  return null;
}
