"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Progress counter up to 90%, then 100% on window load
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 14;
      });
    }, 100);

    const handleLoad = () => {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => setVisible(false), 600);
      }, 400);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-all duration-600 ${
        fadeOut ? "opacity-0 pointer-events-none scale-105" : "opacity-100 scale-100"
      }`}
    >
      {/* Original Logo with Silver Shine overlay */}
      <div className="relative mb-12 flex items-center justify-center">
        <Image
          src="/small_logo.png"
          alt="S4 Logo"
          width={150}
          height={150}
          priority
          className="object-contain"
        />

        {/* Silver shine beam */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            maskImage: "url(/small_logo.png)",
            WebkitMaskImage: "url(/small_logo.png)",
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
          }}
        >
          <div className="absolute top-0 left-0 w-[200%] h-[60px] bg-gradient-to-r from-transparent via-white/85 to-transparent animate-silver-shine shadow-[0_0_20px_rgba(255,255,255,0.9)]" />
        </div>
      </div>

      {/* Loading progress bar */}
      <div className="w-72 h-1.5 bg-zinc-800 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-[#3B388D] rounded-full transition-all duration-200 ease-out shadow-[0_0_10px_rgba(59,56,141,0.8)]"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Percentage text */}
      <p className="mt-4 text-zinc-400 text-sm font-mono tracking-widest font-semibold">
        {Math.min(Math.round(progress), 100)}%
      </p>
    </div>
  );
}
