"use client";

import { useEffect, useRef, useState, useCallback, type FormEvent } from "react";

type Web3FormsResponse = {
  success?: boolean;
  message?: string;
};

export default function ContactSection() {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
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
      if (customEvent.detail === "#contact") {
        triggerHighlight();
      }
    };

    const handleHashChange = () => {
      if (window.location.hash === "#contact") {
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

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.append("access_key", "3491fe3b-2a40-4b54-9e93-6fe3a59f3ee8");

    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data: Web3FormsResponse = await response.json();

      if (!response.ok || !data.success) {
        setResult({
          type: "error",
          message: data.message || "Your message could not be sent. Please try again.",
        });
        return;
      }

      form.reset();
      setResult({
        type: "success",
        message: "Thanks for reaching out. Your message has been sent.",
      });
    } catch {
      setResult({
        type: "error",
        message: "We could not connect to send your message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full p-0 m-0 scroll-mt-0 overflow-hidden"
      aria-label="Contact Section"
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
          className={`relative w-full min-h-[600px] md:h-[calc(100vh-4.5rem)] md:min-h-[560px] md:max-h-[700px] bg-zinc-950/80 backdrop-blur-sm transition-all duration-700 ease-out ${
            isHighlighted
              ? "border-2 border-blue-400 shadow-[0_0_35px_rgba(59,56,141,0.65),inset_0_0_20px_rgba(59,56,141,0.25)]"
              : "border-2 border-transparent shadow-none"
          }`}
        >
          <div className="relative mx-auto flex h-full w-full max-w-3xl flex-col justify-center px-5 py-8 sm:px-8">
            <div className="mb-6 text-center">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Contact Us
              </p>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Get in touch
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
                Have a question or need our services? Send us a message and
                we&apos;ll get back to you.
              </p>
            </div>

            <form
              onSubmit={onSubmit}
              className="space-y-4 rounded-2xl border border-white/10 bg-black/40 p-5 shadow-xl backdrop-blur-md sm:p-7"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="contact-name"
                    className="text-sm font-medium text-zinc-200"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    required
                    className="w-full rounded-lg border border-white/10 bg-zinc-900/80 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="contact-email"
                    className="text-sm font-medium text-zinc-200"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    className="w-full rounded-lg border border-white/10 bg-zinc-900/80 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="contact-message"
                  className="text-sm font-medium text-zinc-200"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={4}
                  className="w-full resize-y rounded-lg border border-white/10 bg-zinc-900/80 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                  placeholder="How can we help?"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSubmitting ? "Sending..." : "Send message"}
              </button>

              {result && (
                <p
                  role={result.type === "error" ? "alert" : "status"}
                  className={
                    result.type === "success"
                      ? "text-sm text-emerald-300"
                      : "text-sm text-red-300"
                  }
                >
                  {result.message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
