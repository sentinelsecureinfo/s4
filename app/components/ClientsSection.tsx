"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export default function ClientsSection() {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerHighlight = useCallback(() => {
    setIsHighlighted(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    // Glow shines for 2.5 seconds upon navbar navigation, then disappears
    timerRef.current = setTimeout(() => {
      setIsHighlighted(false);
    }, 2500);
  }, []);

  useEffect(() => {
    // Only triggers on navbar click event (not normal scroll)
    const handleNavClick = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail === "#clients") {
        triggerHighlight();
      }
    };

    const handleHashChange = () => {
      if (window.location.hash === "#clients") {
        triggerHighlight();
      }
    };

    window.addEventListener("nav-section-click", handleNavClick);
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("nav-section-click", handleNavClick);
      window.removeEventListener("hashchange", handleHashChange);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [triggerHighlight]);

  return (
    <section
      id="clients"
      className="relative w-full p-0 m-0 scroll-mt-0 overflow-hidden"
      aria-label="Clients Section"
    >
      <div className="relative w-full">
        {/* Soft ambient bloom glow behind the container - active only during navbar glow */}
        <div
          className={`absolute -inset-1 bg-gradient-to-r from-[#3B388D]/40 via-blue-500/25 to-[#3B388D]/40 blur-xl transition-opacity duration-700 pointer-events-none ${
            isHighlighted ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Full viewport width container - border is invisible when idle */}
        <div
          className={`relative w-full h-[calc(100vh-4.5rem)] min-h-[400px] sm:min-h-[500px] md:min-h-[560px] max-h-[640px] sm:max-h-[700px] bg-zinc-950/80 backdrop-blur-sm transition-all duration-700 ease-out ${
            isHighlighted
              ? "border-2 border-blue-400 shadow-[0_0_35px_rgba(59,56,141,0.65),inset_0_0_20px_rgba(59,56,141,0.25)]"
              : "border-2 border-transparent shadow-none"
          }`}
        />
      </div>
    </section>
  );
}
