"use client";

import {
  useState,
  useEffect,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";

type ApplicationType = "job" | "guard";

type Web3FormsResponse = {
  success?: boolean;
  message?: string;
};

const navItems = [
  { label: "HOME", href: "/" },
  { label: "SERVICES", href: "#services" },
  { label: "OUR CLIENTS", href: "#clients" },
  { label: "ABOUT", href: "#about" },
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
  const [applicationType, setApplicationType] = useState<ApplicationType | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationResult, setApplicationResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [nidFileName, setNidFileName] = useState("");
  const [nidFileError, setNidFileError] = useState("");
  const [postSelectionError, setPostSelectionError] = useState("");

  // Close mobile menu on desktop resize or Escape key
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setApplicationType(null);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const openApplicationForm = (type: ApplicationType) => {
    setApplicationResult(null);
    setNidFileName("");
    setNidFileError("");
    setPostSelectionError("");
    setApplicationType(type);
    setMobileMenuOpen(false);
  };

  const handleNidFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setNidFileError("");
    setNidFileName("");

    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      event.target.value = "";
      setNidFileError("Choose a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      event.target.value = "";
      setNidFileError("The image must be 5 MB or smaller.");
      return;
    }

    setNidFileName(file.name);
  };

  const handleApplicationSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (
      applicationType === "guard" &&
      form.querySelectorAll<HTMLInputElement>(
        'input[name="post_types[]"]:checked'
      ).length === 0
    ) {
      setPostSelectionError("Select at least one post type.");
      return;
    }

    const nidFile = form.elements.namedItem("attachment");
    if (nidFile instanceof HTMLInputElement && nidFile.files?.[0]) {
      const file = nidFile.files[0];
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setNidFileError("Choose a JPG, PNG, or WebP image.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setNidFileError("The image must be 5 MB or smaller.");
        return;
      }
    }

    const formData = new FormData(form);
    formData.append("access_key", "3491fe3b-2a40-4b54-9e93-6fe3a59f3ee8");
    formData.append(
      "subject",
      applicationType === "guard"
        ? "New Security Guard Service Request"
        : "New Job Application"
    );

    setIsSubmitting(true);
    setApplicationResult(null);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data: Web3FormsResponse = await response.json();

      if (!response.ok || !data.success) {
        setApplicationResult({
          type: "error",
          message:
            data.message || "Your application could not be sent. Please try again.",
        });
        return;
      }

      form.reset();
      setNidFileName("");
      setApplicationResult({
        type: "success",
        message:
          applicationType === "guard"
            ? "Thank you. Your security coverage request has been sent."
            : "Thank you. Your application has been sent successfully.",
      });
    } catch {
      setApplicationResult({
        type: "error",
        message:
          "We could not connect to send your application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNavClick = (
    e: React.MouseEvent,
    href: string,
    label: string
  ) => {
    setActiveItem(label);
    if (typeof window === "undefined") return;

    if (href === "/") {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      window.history.pushState(null, "", "/");
      return;
    }

    if (href.startsWith("#")) {
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        e.preventDefault();
        const ticker = document.getElementById("navbar-ticker");
        const headerBar = document.getElementById("navbar-header-bar");
        const navbarHeight =
          (ticker ? ticker.offsetHeight : 0) +
          (headerBar ? headerBar.offsetHeight : 0);

        const targetTop =
          targetElement.getBoundingClientRect().top + window.scrollY;
        // Position target section exactly flush beneath the sticky navbar
        const targetScrollPosition = Math.max(0, targetTop - navbarHeight);

        window.scrollTo({
          top: targetScrollPosition,
          behavior: "smooth",
        });

        window.history.pushState(null, "", href);
        window.dispatchEvent(
          new CustomEvent("nav-section-click", { detail: href })
        );
      }
    }
  };

  return (
    <div id="main-navbar" className="w-full sticky top-0 z-40">
      
      {/* Compact Top News Headlines Marquee Ticker Bar */}
      <div
        id="navbar-ticker"
        className="w-full bg-zinc-950 border-b border-white/10 text-white py-1 px-4 flex items-center overflow-hidden relative shadow-inner"
      >
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
          <div
            id="navbar-header-bar"
            className="flex items-center justify-between h-14 md:h-16"
          >
            
            {/* Big Logo on the Left */}
            <Link
              href="/"
              onClick={(e) => handleNavClick(e, "/", "HOME")}
              className="flex items-center group shrink-0"
            >
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
            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-7 text-[11px] xl:text-xs font-extrabold tracking-wider">
              {navItems.map((item) => {
                const isActive = activeItem === item.label;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href, item.label)}
                    className={`relative py-1 transition-all duration-200 uppercase whitespace-nowrap ${
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
            <div className="hidden sm:flex items-center space-x-2 xl:space-x-2.5 shrink-0">
              
              {/* Button 1: APPLY FOR A JOB (Red) */}
              <button
                type="button"
                onClick={() => openApplicationForm("job")}
                className="group relative overflow-hidden bg-[#e61e2b] hover:bg-red-600 text-white text-[10px] md:text-[11px] xl:text-xs font-extrabold px-3 sm:px-3.5 md:px-4 py-1.5 md:py-2 rounded-full uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-red-600/40 hover:scale-105 active:scale-95 flex items-center justify-center whitespace-nowrap"
              >
                <span className="relative z-10">APPLY FOR A JOB</span>
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
                  <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-[150%] -skew-x-[25deg] group-hover:animate-button-shine-hover" />
                </div>
              </button>

              {/* Button 2: APPLY FOR A GUARD (Green) */}
              <button
                type="button"
                onClick={() => openApplicationForm("guard")}
                className="group relative overflow-hidden bg-[#10B981] hover:bg-[#059669] text-white text-[10px] md:text-[11px] xl:text-xs font-extrabold px-3 sm:px-3.5 md:px-4 py-1.5 md:py-2 rounded-full uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 flex items-center justify-center whitespace-nowrap"
              >
                <span className="relative z-10">APPLY FOR A GUARD</span>
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
                  <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-[150%] -skew-x-[25deg] group-hover:animate-button-shine-hover" />
                </div>
              </button>

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
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleNavClick(e, item.href, item.label);
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
              
              <button
                type="button"
                onClick={() => openApplicationForm("job")}
                className="group relative overflow-hidden text-center w-full bg-[#e61e2b] text-white font-extrabold px-5 py-2.5 text-xs rounded-full uppercase tracking-wider shadow-md active:scale-95"
              >
                <span className="relative z-10">APPLY FOR A JOB</span>
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
                  <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-[150%] -skew-x-[25deg] group-hover:animate-button-shine-hover" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => openApplicationForm("guard")}
                className="group relative overflow-hidden text-center w-full bg-[#10B981] text-white font-extrabold px-5 py-2.5 text-xs rounded-full uppercase tracking-wider shadow-md active:scale-95"
              >
                <span className="relative z-10">APPLY FOR A GUARD</span>
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
                  <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-[150%] -skew-x-[25deg] group-hover:animate-button-shine-hover" />
                </div>
              </button>

            </div>
          </div>
        )}
      </header>
      {applicationType && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setApplicationType(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="application-form-title"
            className="relative my-auto flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-indigo-300/20 bg-zinc-950 text-white shadow-[0_25px_100px_rgba(0,0,0,0.65)]"
          >
            <header className="relative shrink-0 overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#3B388D] via-[#34317e] to-zinc-950 px-6 py-6 sm:px-8">
              <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-blue-300/10 blur-3xl" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-200">
                    Sentinel Secure Services
                  </p>
                  <h2
                    id="application-form-title"
                    className="text-2xl font-bold sm:text-3xl"
                  >
                    {applicationType === "guard"
                      ? "Request Security Guards"
                      : "Apply for a Job"}
                  </h2>
                  <p className="mt-2 max-w-lg text-sm leading-6 text-indigo-100/75">
                    {applicationType === "guard"
                      ? "Tell us about your site and security needs. Our team will contact you to discuss coverage."
                      : "Share your details below. Our recruitment team will review your application and contact you."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setApplicationType(null)}
                  aria-label="Close application form"
                  className="shrink-0 rounded-lg border border-white/15 bg-white/5 p-2 text-white/75 transition hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
                >
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </header>

            <form
              onSubmit={handleApplicationSubmit}
              encType="multipart/form-data"
              className="overflow-y-auto px-6 py-6 sm:px-8"
            >
              <input
                type="hidden"
                name="application_type"
                value={
                  applicationType === "guard"
                    ? "Security Guard Service Request"
                    : "Job Application"
                }
              />

              {applicationType === "job" ? (
                <>
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3B388D] text-sm font-bold text-white ring-4 ring-[#3B388D]/20">
                  1
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Personal information
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Fields marked * are required
                  </p>
                </div>
              </div>

              <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="applicant-name"
                    className="text-sm font-medium text-zinc-200"
                  >
                    Full name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="applicant-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    required
                    className="w-full rounded-xl border border-indigo-200/15 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 hover:border-indigo-200/30 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="applicant-phone"
                    className="text-sm font-medium text-zinc-200"
                  >
                    Phone number <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="applicant-phone"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    required
                    className="w-full rounded-xl border border-indigo-200/15 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 hover:border-indigo-200/30 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15"
                    placeholder="+880 1XXX-XXXXXX"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="applicant-email"
                    className="text-sm font-medium text-zinc-200"
                  >
                    Email address <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="applicant-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-indigo-200/15 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 hover:border-indigo-200/30 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="applicant-position"
                    className="text-sm font-medium text-zinc-200"
                  >
                    Position applying for{" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="applicant-position"
                    name="position"
                    required
                    className="w-full rounded-xl border border-indigo-200/15 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition hover:border-indigo-200/30 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select a position
                    </option>
                    <option value="Security Guard">Security Guard</option>
                    <option value="Field Officer">Field Officer</option>
                    <option value="Security Supervisor">
                      Security Supervisor
                    </option>
                    <option value="Operations Officer">
                      Operations Officer
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label
                    htmlFor="applicant-address"
                    className="text-sm font-medium text-zinc-200"
                  >
                    Present address <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="applicant-address"
                    name="address"
                    autoComplete="street-address"
                    required
                    rows={2}
                    className="w-full resize-y rounded-xl border border-indigo-200/15 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 hover:border-indigo-200/30 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15"
                    placeholder="House/road, area, city, district"
                  />
                </div>
              </div>

              <div className="mb-4 mt-7 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3B388D] text-sm font-bold text-white ring-4 ring-[#3B388D]/20">
                  2
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    NID card photo
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Optional — upload a clear image if available
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-dashed border-indigo-300/30 bg-[#3B388D]/10 p-4 transition hover:border-indigo-300/60 hover:bg-[#3B388D]/15 sm:p-5">
                <label
                  htmlFor="applicant-nid"
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center focus-within:outline-none"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#3B388D]/50 text-indigo-100">
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14v4a2 2 0 002 2h10a2 2 0 002-2v-4"
                      />
                    </svg>
                  </span>
                  <span className="text-sm font-semibold text-indigo-100">
                    {nidFileName || "Choose an NID card image"}
                  </span>
                  <span className="text-xs text-zinc-400">
                    JPG, PNG, or WebP · maximum 5 MB
                  </span>
                  <input
                    id="applicant-nid"
                    type="file"
                    name="attachment"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleNidFileChange}
                    className="sr-only"
                  />
                </label>
                {nidFileError && (
                  <p role="alert" className="mt-3 text-center text-sm text-red-300">
                    {nidFileError}
                  </p>
                )}
                <p className="mt-3 text-center text-xs leading-5 text-zinc-500">
                  NID image attachments require Web3Forms Pro. Only upload your
                  own ID, and only if you are comfortable sharing it.
                </p>
              </div>

              <div className="mb-4 mt-7 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3B388D] text-sm font-bold text-white ring-4 ring-[#3B388D]/20">
                  3
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Additional information
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Anything else you would like our team to know
                  </p>
                </div>
              </div>

              <textarea
                id="applicant-message"
                name="message"
                rows={3}
                className="w-full resize-y rounded-xl border border-indigo-200/15 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 hover:border-indigo-200/30 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15"
                placeholder="Add any other details relevant to your application"
              />
                </>
              ) : (
                <>
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3B388D] text-sm font-bold text-white ring-4 ring-[#3B388D]/20">
                      1
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        Client and site details
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Fields marked * are required
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="client-contact-name"
                        className="text-sm font-medium text-zinc-200"
                      >
                        Contact person <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="client-contact-name"
                        type="text"
                        name="name"
                        autoComplete="name"
                        required
                        className="w-full rounded-xl border border-indigo-200/15 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 hover:border-indigo-200/30 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="client-organization"
                        className="text-sm font-medium text-zinc-200"
                      >
                        Company / organization
                      </label>
                      <input
                        id="client-organization"
                        type="text"
                        name="organization"
                        autoComplete="organization"
                        className="w-full rounded-xl border border-indigo-200/15 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 hover:border-indigo-200/30 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15"
                        placeholder="Company or organization name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="client-phone"
                        className="text-sm font-medium text-zinc-200"
                      >
                        Phone number <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="client-phone"
                        type="tel"
                        name="phone"
                        autoComplete="tel"
                        required
                        className="w-full rounded-xl border border-indigo-200/15 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 hover:border-indigo-200/30 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15"
                        placeholder="+880 1XXX-XXXXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="client-email"
                        className="text-sm font-medium text-zinc-200"
                      >
                        Email address <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="client-email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        className="w-full rounded-xl border border-indigo-200/15 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 hover:border-indigo-200/30 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15"
                        placeholder="you@example.com"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label
                        htmlFor="client-site-address"
                        className="text-sm font-medium text-zinc-200"
                      >
                        Security site address{" "}
                        <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        id="client-site-address"
                        name="site_address"
                        required
                        rows={2}
                        className="w-full resize-y rounded-xl border border-indigo-200/15 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 hover:border-indigo-200/30 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15"
                        placeholder="Building/site name, area, city, district"
                      />
                    </div>
                  </div>

                  <div className="mb-4 mt-7 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3B388D] text-sm font-bold text-white ring-4 ring-[#3B388D]/20">
                      2
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        Guard coverage
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Specify how many guards and posts you need
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="guard-quantity"
                        className="text-sm font-medium text-zinc-200"
                      >
                        Number of guards <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="guard-quantity"
                        type="number"
                        name="guard_quantity"
                        min="1"
                        max="500"
                        defaultValue="1"
                        required
                        className="w-full rounded-xl border border-indigo-200/15 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition hover:border-indigo-200/30 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="post-quantity"
                        className="text-sm font-medium text-zinc-200"
                      >
                        Number of posts <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="post-quantity"
                        type="number"
                        name="post_quantity"
                        min="1"
                        max="500"
                        defaultValue="1"
                        required
                        className="w-full rounded-xl border border-indigo-200/15 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition hover:border-indigo-200/30 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label
                        htmlFor="coverage-shift"
                        className="text-sm font-medium text-zinc-200"
                      >
                        Coverage schedule{" "}
                        <span className="text-red-400">*</span>
                      </label>
                      <select
                        id="coverage-shift"
                        name="coverage_schedule"
                        required
                        defaultValue=""
                        className="w-full rounded-xl border border-indigo-200/15 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition hover:border-indigo-200/30 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15"
                      >
                        <option value="" disabled>
                          Select a coverage schedule
                        </option>
                        <option value="Day shift">Day shift</option>
                        <option value="Night shift">Night shift</option>
                        <option value="24-hour coverage">
                          24-hour coverage
                        </option>
                        <option value="Custom schedule">Custom schedule</option>
                      </select>
                    </div>
                  </div>

                  <fieldset className="mt-5">
                    <legend className="text-sm font-medium text-zinc-200">
                      Select the post types you need{" "}
                      <span className="text-red-400">*</span>
                    </legend>
                    <p className="mt-1 text-xs text-zinc-400">
                      Choose all that apply. A post is a guard station or duty
                      assignment at your site.
                    </p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {[
                        "Entry / gate security",
                        "Building / lobby security",
                        "Patrol / perimeter security",
                        "Reception / visitor management",
                        "Industrial / warehouse security",
                        "Event security",
                        "Other post type",
                      ].map((postType) => (
                        <label
                          key={postType}
                          className="flex cursor-pointer items-center gap-3 rounded-lg border border-indigo-200/10 bg-zinc-900/60 px-3 py-3 text-sm text-zinc-200 transition hover:border-indigo-300/30 hover:bg-[#3B388D]/15"
                        >
                          <input
                            type="checkbox"
                            name="post_types[]"
                            value={postType}
                            onChange={() => setPostSelectionError("")}
                            className="h-4 w-4 rounded border-indigo-200/30 bg-zinc-900 text-[#514dcc] accent-[#514dcc] focus:ring-indigo-400"
                          />
                          {postType}
                        </label>
                      ))}
                    </div>
                    {postSelectionError && (
                      <p role="alert" className="mt-2 text-sm text-red-300">
                        {postSelectionError}
                      </p>
                    )}
                  </fieldset>

                  <div className="mb-4 mt-7 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3B388D] text-sm font-bold text-white ring-4 ring-[#3B388D]/20">
                      3
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        Additional details
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Share any special requirements for your site
                      </p>
                    </div>
                  </div>

                  <textarea
                    id="guard-request-message"
                    name="message"
                    rows={3}
                    className="w-full resize-y rounded-xl border border-indigo-200/15 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 hover:border-indigo-200/30 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15"
                    placeholder="Describe any special instructions, preferred start date, or other requirements"
                  />
                </>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3B388D] to-[#514dcc] px-5 py-3.5 font-bold text-white shadow-lg shadow-[#3B388D]/25 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Submitting request...
                  </>
                ) : (
                  applicationType === "guard"
                    ? "Request security coverage"
                    : "Submit application"
                )}
              </button>

              {applicationResult && (
                <p
                  role={
                    applicationResult.type === "error" ? "alert" : "status"
                  }
                  className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
                    applicationResult.type === "success"
                      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                      : "border-red-400/20 bg-red-400/10 text-red-300"
                  }`}
                >
                  {applicationResult.message}
                </p>
              )}
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
