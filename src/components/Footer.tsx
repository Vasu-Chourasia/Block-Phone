"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full bg-[#050505] border-t border-white/5 py-16 px-6 md:px-12 selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Side Info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-sans text-lg font-bold tracking-tight text-white mb-3 hover:text-cyan-400 transition-colors duration-300"
          >
            Block <span className="font-light text-zinc-400">Phone</span>
          </button>
          <p className="font-sans text-xs text-zinc-500 max-w-sm leading-relaxed">
            A vision of next-generation hardware engineering. Designed for durability, upgradeability, and infinite personalization.
          </p>
        </div>

        {/* Right Side Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
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
              className="font-sans text-[10px] tracking-widest text-zinc-500 hover:text-white uppercase transition-colors duration-300"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-footer details */}
      <div className="max-w-7xl mx-auto border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-wider">
          © {currentYear} Block Phone. Designed by Antigravity. All rights reserved.
        </span>
        <div className="flex gap-4">
          <span className="font-sans text-[10px] text-zinc-600 hover:text-zinc-400 cursor-pointer">
            Privacy Policy
          </span>
          <span className="font-sans text-[10px] text-zinc-600 hover:text-zinc-400 cursor-pointer">
            Terms of Use
          </span>
        </div>
      </div>
    </footer>
  );
}
