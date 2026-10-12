"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const navItems = [
  { label: "HOME", href: "/" },
  { label: "ABOUT", href: "#about" },
  { label: "SERVICES", href: "#services" },
  { label: "OUR CLIENTS", href: "#clients" },
  { label: "CONTACT", href: "#contact" },
];

const headlines = [
  "🚨 Sentinel Secure Services: 24/7 Professional Manned Guarding & Emergency Response Available nationwide!",
  "⚡ WE ARE HIRING: Experienced Security Guards & Field Officers Wanted — Apply for a job today!",
  "🛡️ Trusted ISO 9001 Certified Security Partner for Commercial, Industrial & Residential Sectors.",
  "📞 Emergency Helpline: +880 1831-337699 — Contact us today for a complimentary risk audit & quote.",
];

export default function Navbar() {
  const [activeItem, setActiveItem] = useState("HOME");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="w-full sticky top-0 z-40">
      
      {/* Compact Top News Headlines Marquee Ticker Bar */}
      <div className="w-full bg-zinc-950 border-b border-white/10 text-white py-1 px-4 flex items-center overflow-hidden relative shadow-inner">
        <div className="overflow-hidden whitespace-nowrap w-full text-[11px] font-semibold text-zinc-300">
          <div className="animate-marquee flex gap-12">
            {[...headlines, ...headlines].map((text, idx) => (
              <span key={idx} className="flex items-center gap-2">
                <span>{text}</span>
                <span className="text-zinc-600">★</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Compact Squared Navbar Header (h-14 md:h-16) */}
      <header className="w-full bg-[#3B388D] text-white shadow-xl border-b border-[#2e2b73] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            
            {/* Big Logo on the Left */}
            <Link href="/" className="flex items-center group shrink-0">
              <Image
                src="/big_logo_nobg.png"
                alt="Sentinel Secure Services"
                width={180}
                height={50}
                priority
                className="h-8 sm:h-10 w-auto object-contain transition-all duration-300 group-hover:scale-105 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
              />
            </Link>

            {/* 5 Navigation Links with Horizontal Underline */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-xs font-extrabold tracking-wider">
              {navItems.map((item) => {
                const isActive = activeItem === item.label;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setActiveItem(item.label)}
                    className={`relative py-1 transition-all duration-200 uppercase ${
                      isActive
                        ? "text-white font-black"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    {item.label}
                    {/* Horizontal Underline Indicator */}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Compact Action Buttons with Hover-Only Silver Shine */}
            <div className="hidden sm:flex items-center space-x-2.5 shrink-0">
              
              {/* Button 1: APPLY FOR A JOB (Red) */}
              <Link
                href="#apply-job"
                className="group relative overflow-hidden bg-[#e61e2b] hover:bg-red-600 text-white text-[11px] md:text-xs font-extrabold px-4 py-2 rounded-full uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-red-600/40 hover:scale-105 active:scale-95 flex items-center justify-center"
              >
                <span className="relative z-10">APPLY FOR A JOB</span>
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
                  <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-[150%] -skew-x-[25deg] group-hover:animate-button-shine-hover" />
                </div>
              </Link>

              {/* Button 2: APPLY FOR A GUARD (Green) */}
              <Link
                href="#apply-guard"
                className="group relative overflow-hidden bg-[#10B981] hover:bg-[#059669] text-white text-[11px] md:text-xs font-extrabold px-4 py-2 rounded-full uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 flex items-center justify-center"
              >
                <span className="relative z-10">APPLY FOR A GUARD</span>
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
                  <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-[150%] -skew-x-[25deg] group-hover:animate-button-shine-hover" />
                </div>
              </Link>

            </div>

            {/* Mobile Hamburger Menu Button */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                type="button"
                className="p-1.5 rounded-lg text-white hover:bg-white/10 focus:outline-none transition-colors"
                aria-label="Toggle mobile menu"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#2e2b73] border-t border-white/10 px-4 pt-3 pb-6 space-y-3 shadow-2xl">
            {navItems.map((item) => {
              const isActive = activeItem === item.label;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => {
                    setActiveItem(item.label);
                    setMobileMenuOpen(false);
                  }}
                  className={`block px-4 py-2 text-sm font-extrabold uppercase transition-all rounded-lg ${
                    isActive
                      ? "bg-white/20 text-white border-l-4 border-white pl-4"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-2 flex flex-col space-y-2.5">
              
              <Link
                href="#apply-job"
                onClick={() => setMobileMenuOpen(false)}
                className="group relative overflow-hidden text-center w-full bg-[#e61e2b] text-white font-extrabold px-5 py-2.5 text-xs rounded-full uppercase tracking-wider shadow-md active:scale-95"
              >
                <span className="relative z-10">APPLY FOR A JOB</span>
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
                  <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-[150%] -skew-x-[25deg] group-hover:animate-button-shine-hover" />
                </div>
              </Link>

              <Link
                href="#apply-guard"
                onClick={() => setMobileMenuOpen(false)}
                className="group relative overflow-hidden text-center w-full bg-[#10B981] text-white font-extrabold px-5 py-2.5 text-xs rounded-full uppercase tracking-wider shadow-md active:scale-95"
              >
                <span className="relative z-10">APPLY FOR A GUARD</span>
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
                  <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-[150%] -skew-x-[25deg] group-hover:animate-button-shine-hover" />
                </div>
              </Link>

            </div>
          </div>
        )}
      </header>
    </div>
  );
}
