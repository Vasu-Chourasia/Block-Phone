"use client";

import { motion } from "framer-motion";
import { Cpu, Eye, Zap, Layers } from "lucide-react";

export default function SpecsSection() {
  const specs = [
    {
      icon: <Layers className="w-8 h-8 text-cyan-400" />,
      tag: "GRID / CHASSIS-M1",
      title: "Magnetic Coupling Matrix",
      desc: "Superconducting Neodymium-Iron-Boron (NdFeB) magnetic tracks with gold-plated spring pins ensure a rigid lock. Delivers 48 Gbps of internal bus bandwidth between modules.",
      value: "48 Gbps",
      unit: "Bus Transfer Speed",
      color: "border-cyan-500/20 shadow-cyan-500/5 hover:border-cyan-400"
    },
    {
      icon: <Eye className="w-8 h-8 text-blue-400" />,
      tag: "OPTICS / VISION-X1",
      title: "Hot-Swappable Camera Blocks",
      desc: "Interchangeable optical blocks. Snap in a 1-inch sensor for high-dynamic-range night photography, or swap to an anamorphic cinematic lens for professional film shoots.",
      value: "50 MP",
      unit: "Upgradeable Sensor",
      color: "border-blue-500/20 shadow-blue-500/5 hover:border-blue-400"
    },
    {
      icon: <Zap className="w-8 h-8 text-cyan-400" />,
      tag: "ENERGY / DUAL-CELL",
      title: "Zero-Downtime Power Swap",
      desc: "A built-in solid-state capacitor maintains full power for 180 seconds. Replace the main battery cell on-the-go without shutting down or losing data.",
      value: "180s",
      unit: "Internal Hot-Swap Buffer",
      color: "border-cyan-500/20 shadow-cyan-500/5 hover:border-cyan-400"
    },
    {
      icon: <Cpu className="w-8 h-8 text-blue-400" />,
      tag: "BRAIN / COMPUTE-M14",
      title: "Upgradeable SOC Engine",
      desc: "Keep up with software evolution. Slide out the main processor module to upgrade your CPU, GPU, RAM, or AI accelerators without discarding the gorgeous chassis.",
      value: "120 Tflops",
      unit: "Neural processing power",
      color: "border-blue-500/20 shadow-blue-500/5 hover:border-blue-400"
    }
  ];

  return (
    <section
      id="specs"
      className="relative w-full bg-[#0A0A0C] py-32 px-6 md:px-12 selection:bg-cyan-500/30 overflow-hidden"
    >
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-20 text-center md:text-left">
          <span className="font-mono text-xs tracking-[0.3em] text-cyan-400 uppercase font-semibold">
            Engineering Blueprint
          </span>
          <h2 className="font-outfit text-4xl md:text-6xl font-extrabold tracking-tight text-white uppercase mt-4 mb-6">
            Technical Specifications
          </h2>
          <p className="font-sans text-sm md:text-base text-zinc-400 max-w-xl leading-relaxed">
            Built for longevity, performance, and circular design. Explore the custom physical connection layers and component blocks that redefine hardware.
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {specs.map((spec, index) => (
            <motion.div
              key={spec.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative flex flex-col justify-between p-8 rounded-2xl glassmorphism border transition-all duration-500 group overflow-hidden ${spec.color}`}
            >
              {/* Inner card grid glow effect */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-50" />
              <div className="absolute -inset-px bg-gradient-to-br from-white/[0.05] to-transparent rounded-2xl pointer-events-none" />

              <div>
                {/* Icon & Tag */}
                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5 group-hover:scale-110 transition-transform duration-300">
                    {spec.icon}
                  </div>
                  <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase">
                    {spec.tag}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-outfit text-xl md:text-2xl font-bold text-white mb-4 relative z-10">
                  {spec.title}
                </h3>
                <p className="font-sans text-xs md:text-sm text-zinc-400 leading-relaxed mb-8 relative z-10">
                  {spec.desc}
                </p>
              </div>

              {/* Technical value banner */}
              <div className="border-t border-white/5 pt-6 flex items-baseline justify-between relative z-10">
                <span className="font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
                  {spec.unit}
                </span>
                <span className="font-outfit text-2xl font-extrabold text-white tracking-tight">
                  {spec.value}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footnote sustainability callout */}
        <div className="mt-16 p-8 rounded-2xl border border-white/5 bg-[#050505] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-mono text-cyan-400 font-bold text-lg">
              e
            </div>
            <div>
              <h4 className="font-outfit text-base font-bold text-white uppercase tracking-wide">
                A Step Forward for the Planet
              </h4>
              <p className="font-sans text-xs text-zinc-400 max-w-xl mt-1 leading-relaxed">
                By allowing individual component replacements, the Block Phone concept reduces global electronics waste (e-waste) by up to 78% compared to standard replacement cycles. Upgrade only what you need.
              </p>
            </div>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-6 py-2.5 rounded-full text-xs font-semibold border border-white/10 text-white hover:bg-white/5 hover:border-white/20 transition-all duration-300 whitespace-nowrap"
          >
            Back to Reveal
          </button>
        </div>
      </div>
    </section>
  );
}
