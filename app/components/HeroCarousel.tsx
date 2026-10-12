"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Slide {
  id: number;
  imageSrc?: string; // Blank placeholder slot for user images
  gradient: string;
}

const slides: Slide[] = [
  {
    id: 1,
    imageSrc: "", // User can add slide 1 image here
    gradient: "from-[#3B388D] via-zinc-950 to-black",
  },
  {
    id: 2,
    imageSrc: "", // User can add slide 2 image here
    gradient: "from-zinc-950 via-red-950/60 to-black",
  },
  {
    id: 3,
    imageSrc: "", // User can add slide 3 image here
    gradient: "from-zinc-950 via-emerald-950/60 to-black",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  const SLIDE_DURATION = 3000; // 3 seconds
  const UPDATE_INTERVAL = 30; // Smooth 30ms timer updates

  useEffect(() => {
    setProgress(0);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 100;
        }
        return prev + (UPDATE_INTERVAL / SLIDE_DURATION) * 100;
      });
    }, UPDATE_INTERVAL);

    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setProgress(0);
    }, SLIDE_DURATION);

    return () => {
      clearInterval(progressTimer);
      clearInterval(slideTimer);
    };
  }, [currentSlide]);

  return (
    <section className="relative w-full overflow-hidden bg-black text-white p-0 m-0">
      {/* Full Viewport-Width Slide Container (No inner margins/borders) */}
      <div className="w-full relative h-[calc(100vh-4.5rem)] max-h-[520px] sm:max-h-[580px]">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {slide.imageSrc ? (
                <Image
                  src={slide.imageSrc}
                  alt={`Slide ${slide.id}`}
                  fill
                  className="object-cover w-full h-full"
                  priority={index === 0}
                />
              ) : (
                /* Full-Width Blank Image Slot Container */
                <div
                  className={`w-full h-full bg-gradient-to-br ${slide.gradient} flex flex-col items-center justify-center relative border-b border-white/10`}
                >
                  {/* Subtle Grid Pattern Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />

                  {/* Placeholder Badge */}
                  <div className="relative z-10 flex flex-col items-center gap-3 text-white/35">
                    <svg
                      className="w-16 h-16 stroke-current"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm font-mono tracking-widest uppercase font-semibold">
                      [ Full-Width Blank Image Slot {slide.id} — Add Image Here ]
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Bottom 3-Second Progress Bar Timer & Slide Counter */}
        <div className="absolute bottom-0 left-0 right-0 z-30 flex flex-col items-center justify-center pb-4 pt-6 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
          <div className="flex items-center gap-3">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 overflow-hidden ${
                  idx === currentSlide
                    ? "w-20 bg-white/30"
                    : "w-4 bg-white/20"
                }`}
              >
                {/* Fill bar animating over 3 seconds for current slide */}
                {idx === currentSlide && (
                  <div
                    className="h-full bg-white rounded-full transition-all ease-linear"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
