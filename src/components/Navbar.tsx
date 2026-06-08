"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (id === "specs") {
      const el = document.getElementById("specs");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    const heroEl = document.getElementById("hero");
    if (heroEl) {
      const rect = heroEl.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const absoluteTop = rect.top + scrollTop;
      const totalHeight = rect.height;

      let targetProgress = 0;
      if (id === "hero") targetProgress = 0.02;
      else if (id === "modularity") targetProgress = 0.28;
      else if (id === "camera") targetProgress = 0.50;
      else if (id === "battery") targetProgress = 0.70;

      // Scroll smoothly to the virtual segment index of the scrollytelling container
      window.scrollTo({
        top: absoluteTop + totalHeight * targetProgress,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out ${
        isScrolled
          ? "bg-transparent border-transparent py-4"
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand/Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-sans text-lg font-bold tracking-tight text-white hover:text-cyan-400 transition-colors duration-300"
        >
          Block <span className="font-light text-zinc-400">Phone</span>
        </button>

        {/* Center Links (Hidden on mobile) */}
        <div className="hidden md:flex items-center space-x-8">
          {[
            { label: "Overview", id: "hero" },
            { label: "Modularity", id: "modularity" },
            { label: "Camera", id: "camera" },
            { label: "Battery", id: "battery" },
            { label: "Specs", id: "specs" }
          ].map((link) => (
            <button
              key={link.label}
              onClick={() => scrollToSection(link.id)}
              className="font-sans text-xs tracking-wider text-zinc-400 hover:text-white transition-colors duration-300 uppercase"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right CTA Button */}
        <div>
          <button
            onClick={() => scrollToSection("specs")}
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-xs font-semibold text-white rounded-full group bg-gradient-to-br from-blue-600 to-cyan-500 hover:text-white focus:ring-2 focus:outline-none focus:ring-cyan-800 transition-all duration-300"
          >
            <span className="relative px-5 py-2 transition-all ease-in duration-75 bg-[#050505] rounded-full group-hover:bg-opacity-0">
              Explore Block Phone
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
