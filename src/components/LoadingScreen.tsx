"use client";

import { useEffect, useState } from "react";

interface LoadingScreenProps {
  progress: number;
}

export default function LoadingScreen({ progress }: LoadingScreenProps) {
  const [statusText, setStatusText] = useState("INITIALIZING CORE SYSTEMS...");

  useEffect(() => {
    const statuses = [
      "ESTABLISHING MAGNETIC COUPLING CHANNELS...",
      "CALIBRATING HOLOGRAPHIC OPTICAL SENSORS...",
      "SYNCHRONIZING LIQUID DISSIPATION BLOCKS...",
      "OPTIMIZING HIGH-DENSITY GRAPHENE FLOW...",
      "TESTING DUAL-CELL POWER CONDUITS...",
      "ALIGNING 120Hz ULTRA-RETINA DISPLAY LAYER...",
      "DECRYPTING PRE-INSTALLED ENGINEERING BUILDS...",
      "BLOCK PHONE IS READY TO EVOLVE..."
    ];

    const interval = setInterval(() => {
      // Pick a random status text based on progress, or cycle them
      const index = Math.min(
        Math.floor((progress / 100) * statuses.length),
        statuses.length - 1
      );
      setStatusText(statuses[index]);
    }, 1200);

    return () => clearInterval(interval);
  }, [progress]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] font-sans selection:bg-cyan-500/30">
      {/* Background soft glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-6 flex flex-col items-center">
        {/* Animated Engineering Wireframe */}
        <div className="relative w-48 h-64 mb-12">
          <svg
            viewBox="0 0 100 140"
            className="w-full h-full text-zinc-700 stroke-current"
            fill="none"
            strokeWidth="0.5"
          >
            {/* Grid background inside phone region */}
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.2" />
            </pattern>
            <rect x="5" y="5" width="90" height="130" rx="8" fill="url(#grid)" stroke="rgba(255,255,255,0.05)" />

            {/* Chassis Outline */}
            <rect
              x="5"
              y="5"
              width="90"
              height="130"
              rx="8"
              className="stroke-zinc-800 animate-pulse"
              strokeWidth="0.8"
            />

            {/* Display Block Outline (separated slightly) */}
            <g className="animate-[bounce_3s_infinite_ease-in-out]">
              <rect
                x="8"
                y="8"
                width="84"
                height="124"
                rx="6"
                className="stroke-blue-500/20"
                strokeDasharray="2 2"
              />
              <path d="M12 12 h76 v116 h-76 z" className="stroke-blue-500/10" strokeWidth="0.3" />
            </g>

            {/* Camera Module Block (floating on top-left) */}
            <g className="translate-y-[-5px] animate-[pulse_2s_infinite_ease-in-out]">
              <rect
                x="12"
                y="12"
                width="32"
                height="40"
                rx="4"
                className="stroke-cyan-500/40 fill-[#050505]/80"
                strokeWidth="0.8"
              />
              {/* Lenses */}
              <circle cx="20" cy="22" r="4" className="stroke-cyan-400/60" />
              <circle cx="36" cy="22" r="3" className="stroke-cyan-400/40" />
              <circle cx="28" cy="38" r="5" className="stroke-cyan-400/70" />
              {/* Laser line inside camera */}
              <line x1="16" y1="46" x2="40" y2="46" className="stroke-cyan-500/30" strokeWidth="0.5" />
            </g>

            {/* Battery Module Block (floating on bottom-right) */}
            <g className="translate-x-[5px] translate-y-[5px] animate-[pulse_3s_infinite_ease-in-out]">
              <rect
                x="48"
                y="56"
                width="40"
                height="72"
                rx="4"
                className="stroke-blue-500/50 fill-[#050505]/80"
                strokeWidth="0.8"
              />
              {/* Battery Cells/Grid */}
              <line x1="54" y1="66" x2="82" y2="66" className="stroke-blue-500/30" />
              <line x1="54" y1="76" x2="82" y2="76" className="stroke-blue-500/30" />
              <line x1="54" y1="86" x2="82" y2="86" className="stroke-blue-500/30" />
              <line x1="54" y1="96" x2="82" y2="96" className="stroke-blue-500/30" />
              <line x1="54" y1="106" x2="82" y2="106" className="stroke-blue-500/30" />
              <line x1="54" y1="116" x2="82" y2="116" className="stroke-blue-500/30" />
              <rect x="52" y="60" width="32" height="62" rx="2" className="stroke-blue-500/20" strokeWidth="0.3" />
            </g>

            {/* Magnetic connection nodes */}
            <circle cx="12" cy="56" r="1.5" className="fill-cyan-400 animate-ping" />
            <circle cx="48" cy="56" r="1.5" className="fill-blue-400 animate-ping" />
          </svg>

          {/* Glowing central indicator */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl animate-pulse" />
        </div>

        {/* Loading progress metadata */}
        <div className="w-full flex items-baseline justify-between mb-3">
          <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
            System Initialization
          </span>
          <span className="font-mono text-xl font-bold text-white glow-text-cyan">
            {progress}%
          </span>
        </div>

        {/* Outer progress bar */}
        <div className="w-full h-[3px] bg-zinc-900 rounded-full overflow-hidden relative border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-300 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* System log simulation text */}
        <div className="mt-4 text-center h-4">
          <p className="font-mono text-[9px] tracking-[0.15em] text-zinc-400 uppercase animate-pulse">
            {statusText}
          </p>
        </div>
      </div>
    </div>
  );
}
