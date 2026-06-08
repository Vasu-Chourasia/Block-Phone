"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, motion, AnimatePresence } from "framer-motion";
import LoadingScreen from "./LoadingScreen";

const TOTAL_FRAMES = 240;

export default function Scrollytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [activePhase, setActivePhase] = useState<"hero" | "reveal" | "camera" | "battery" | "cta">("hero");

  // Track the raw scroll progress of the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Preload frames progressively on mount
  useEffect(() => {
    const keyFrameInterval = 3; // Load every 3rd frame initially (80 frames)
    const keyFrameIndexes: number[] = [];
    const remainingFrameIndexes: number[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      if (i === 1 || i === TOTAL_FRAMES || i % keyFrameInterval === 0) {
        keyFrameIndexes.push(i);
      } else {
        remainingFrameIndexes.push(i);
      }
    }

    let loadedKeyCount = 0;
    const preloadedImages: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    const sampleBackground = (img: HTMLImageElement) => {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = 10;
      tempCanvas.height = 10;
      const tempCtx = tempCanvas.getContext("2d");
      if (tempCtx) {
        tempCtx.drawImage(img, 0, 0, 10, 10);
        const p1 = tempCtx.getImageData(0, 0, 1, 1).data;
        const p2 = tempCtx.getImageData(9, 0, 1, 1).data;
        const p3 = tempCtx.getImageData(0, 9, 1, 1).data;
        const p4 = tempCtx.getImageData(9, 9, 1, 1).data;

        // Average the four corner pixels to get the background color
        const r = Math.round((p1[0] + p2[0] + p3[0] + p4[0]) / 4);
        const g = Math.round((p1[1] + p2[1] + p3[1] + p4[1]) / 4);
        const b = Math.round((p1[2] + p2[2] + p3[2] + p4[2]) / 4);

        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        document.documentElement.style.setProperty("--bg-sampled", hex);
      }
    };

    // Load remaining frames sequentially to keep the main thread responsive
    const loadRemainingFrames = (index: number) => {
      if (index >= remainingFrameIndexes.length) return;
      const frameNum = remainingFrameIndexes[index];
      const img = new Image();
      const frameIndex = String(frameNum).padStart(3, "0");
      img.src = `/Exploded Block Phone/ezgif-frame-${frameIndex}.jpg`;
      img.onload = () => {
        preloadedImages[frameNum - 1] = img;
        // Load the next image after a tiny delay to allow scrolling interactions to remain smooth
        setTimeout(() => loadRemainingFrames(index + 1), 15);
      };
      img.onerror = () => {
        preloadedImages[frameNum - 1] = preloadedImages[0];
        setTimeout(() => loadRemainingFrames(index + 1), 15);
      };
    };

    // Load key frames first
    keyFrameIndexes.forEach((frameNum) => {
      const img = new Image();
      const frameIndex = String(frameNum).padStart(3, "0");
      img.src = `/Exploded Block Phone/ezgif-frame-${frameIndex}.jpg`;
      img.onload = () => {
        preloadedImages[frameNum - 1] = img;
        loadedKeyCount++;
        
        const percent = Math.round((loadedKeyCount / keyFrameIndexes.length) * 100);
        setLoadProgress(percent);

        if (loadedKeyCount === keyFrameIndexes.length) {
          setIsLoading(false);
          if (preloadedImages[0]) {
            sampleBackground(preloadedImages[0]);
          }
          // Start the sequential background load queue
          setTimeout(() => loadRemainingFrames(0), 100);
        }
      };
      img.onerror = () => {
        loadedKeyCount++;
        if (loadedKeyCount === keyFrameIndexes.length) {
          setIsLoading(false);
          setTimeout(() => loadRemainingFrames(0), 100);
        }
      };
    });

    imagesRef.current = preloadedImages;
  }, []);

  // Update target frame based on scroll position
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      // Map scroll progress (0 to 1) to frame index (0 to 239)
      const targetFrame = Math.min(
        Math.floor(progress * TOTAL_FRAMES),
        TOTAL_FRAMES - 1
      );
      targetFrameRef.current = targetFrame;

      // Update active phase for overlay copy
      if (progress < 0.15) {
        setActivePhase("hero");
      } else if (progress >= 0.15 && progress < 0.40) {
        setActivePhase("reveal");
      } else if (progress >= 0.40 && progress < 0.60) {
        setActivePhase("camera");
      } else if (progress >= 0.60 && progress < 0.80) {
        setActivePhase("battery");
      } else {
        setActivePhase("cta");
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  // Find nearest loaded frame if intermediate frame is still fetching
  const getNearestLoadedFrame = (index: number): HTMLImageElement | null => {
    const images = imagesRef.current;
    if (images[index] && images[index].complete) {
      return images[index];
    }

    // Outward search for the closest loaded frame to prevent visual flicker
    let step = 1;
    while (step < TOTAL_FRAMES) {
      const prev = index - step;
      const next = index + step;

      if (prev >= 0 && images[prev] && images[prev].complete) {
        return images[prev];
      }
      if (next < TOTAL_FRAMES && images[next] && images[next].complete) {
        return images[next];
      }
      step++;
    }
    return null;
  };

  // Main Canvas Render Loop (with Lerping/momentum)
  useEffect(() => {
    if (isLoading) return;

    let animationFrameId: number;
    let lastDrawnFrame = -1;

    const drawFrame = (frameIndex: number) => {
      // Prevent redundant draws of the identical frame to optimize GPU paint cycles
      if (frameIndex === lastDrawnFrame) return;
      lastDrawnFrame = frameIndex;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = getNearestLoadedFrame(frameIndex);
      if (!img || !img.complete) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Maintain aspect ratio: contain style
      const imgRatio = img.width / img.height;
      const canvasRatio = canvas.width / canvas.height;
      let drawWidth, drawHeight, drawX, drawY;

      if (canvasRatio > imgRatio) {
        drawHeight = canvas.height;
        drawWidth = canvas.height * imgRatio;
        drawX = (canvas.width - drawWidth) / 2;
        drawY = 0;
      } else {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        drawX = 0;
        drawY = (canvas.height - drawHeight) / 2;
      }

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

      // Mask/hide the bottom-right watermark star dynamically (Star is at X:1160-1207, Y:600-647)
      const scaleX = drawWidth / 1280;
      const scaleY = drawHeight / 720;
      const patchX = drawX + 1150 * scaleX;
      const patchY = drawY + 590 * scaleY;
      const patchW = 67 * scaleX;
      const patchH = 67 * scaleY;

      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--bg-sampled").trim() || "#050505";
      ctx.fillRect(patchX, patchY, patchW, patchH);
    };

    const updateAndDraw = () => {
      const current = currentFrameRef.current;
      const target = targetFrameRef.current;

      // Butter-smooth lerping: move 7% of the distance each frame
      const diff = target - current;
      if (Math.abs(diff) > 0.01) {
        currentFrameRef.current += diff * 0.07;
        drawFrame(Math.round(currentFrameRef.current));
      } else if (current !== target) {
        currentFrameRef.current = target;
        drawFrame(target);
      }

      animationFrameId = requestAnimationFrame(updateAndDraw);
    };

    // Initialize first frame
    drawFrame(0);
    updateAndDraw();

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      drawFrame(Math.round(currentFrameRef.current));
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isLoading]);

  const scrollToSpecs = () => {
    const el = document.getElementById("specs");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen progress={loadProgress} />}
      </AnimatePresence>

      <div
        ref={containerRef}
        id="hero"
        className="relative w-full h-[500vh] bg-[#050505] selection:bg-blue-500/20"
      >
        {/* Sticky Canvas viewport */}
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden z-10 flex items-center justify-center">
          {/* Dynamic background glow based on active sections */}
          <div
            className={`absolute inset-0 transition-all duration-1000 pointer-events-none ${
              activePhase === "hero"
                ? "bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.08)_0%,transparent_60%)]"
                : activePhase === "reveal"
                ? "bg-[radial-gradient(circle_at_center,rgba(0,224,255,0.06)_0%,transparent_60%)]"
                : activePhase === "camera"
                ? "bg-[radial-gradient(circle_at_35%_35%,rgba(0,224,255,0.1)_0%,transparent_50%)]"
                : activePhase === "battery"
                ? "bg-[radial-gradient(circle_at_65%_65%,rgba(0,102,255,0.1)_0%,transparent_50%)]"
                : "bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.12)_0%,rgba(0,224,255,0.06)_40%,transparent_75%)]"
            }`}
          />

          <canvas ref={canvasRef} className="block pointer-events-none" />

          {/* Interactive Engineering HUD elements */}
          <AnimatePresence>
            {activePhase === "camera" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute top-[32%] left-[42%] md:top-[30%] md:left-[45%] z-20 flex items-center gap-3 pointer-events-none"
              >
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                </div>
                <div className="glassmorphism-light px-3 py-1.5 rounded-md border border-cyan-500/20 backdrop-blur-sm">
                  <p className="font-mono text-[9px] text-cyan-400 tracking-wider font-semibold">
                    SYS: CAMERA_MOD_01
                  </p>
                  <p className="font-sans text-[10px] text-white/80">
                    50MP Dual Lens | Active
                  </p>
                </div>
              </motion.div>
            )}

            {activePhase === "battery" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute bottom-[35%] right-[38%] md:bottom-[32%] md:right-[43%] z-20 flex items-center gap-3 pointer-events-none"
              >
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </div>
                <div className="glassmorphism-light px-3 py-1.5 rounded-md border border-blue-500/20 backdrop-blur-sm">
                  <p className="font-mono text-[9px] text-blue-400 tracking-wider font-semibold">
                    SYS: BATT_PACK_02
                  </p>
                  <p className="font-sans text-[10px] text-white/80">
                    4,800mAh Graphene | Standby
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scrolling Copy overlays */}
          <div className="absolute inset-0 z-20 flex flex-col justify-between px-6 md:px-24 py-32 pointer-events-none select-none">
            
            {/* HERO PHASE (0% - 15%) */}
            <AnimatePresence>
              {activePhase === "hero" && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
                >
                  <span className="font-mono text-xs tracking-[0.4em] text-blue-500 uppercase mb-4 glow-text-blue font-semibold">
                    Concept Reveal
                  </span>
                  <h1 className="font-outfit text-6xl md:text-8xl font-extrabold tracking-tighter text-white uppercase leading-none mb-6">
                    Block Phone
                  </h1>
                  <p className="font-sans text-lg md:text-2xl font-light tracking-wide text-zinc-400 max-w-xl leading-relaxed">
                    Built to evolve. A smartphone that adapts to you.
                  </p>
                  <div className="mt-8 flex flex-col items-center gap-2">
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest animate-bounce">
                      Scroll to disassemble
                    </span>
                    <svg className="w-4 h-4 text-zinc-600 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* MODULAR REVEAL PHASE (15% - 40%) */}
            <AnimatePresence>
              {activePhase === "reveal" && (
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-y-0 left-6 md:left-24 flex flex-col justify-center max-w-md pointer-events-auto"
                >
                  <span className="font-mono text-[10px] tracking-[0.25em] text-cyan-400 uppercase mb-3 font-semibold">
                    Modularity
                  </span>
                  <h2 className="font-outfit text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 uppercase leading-tight">
                    Designed to be taken apart.
                  </h2>
                  <p className="font-sans text-sm md:text-base text-zinc-400 mb-4 leading-relaxed">
                    Swap your camera. Replace your battery. Upgrade your display.
                  </p>
                  <p className="font-sans text-xs md:text-sm text-zinc-500 leading-relaxed">
                    No tools. No limits. Just precision-engineered magnetic connection matrices.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CAMERA MODULE PHASE (40% - 60%) */}
            <AnimatePresence>
              {activePhase === "camera" && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-y-0 right-6 md:right-24 flex flex-col justify-center max-w-md text-right items-end pointer-events-auto"
                >
                  <span className="font-mono text-[10px] tracking-[0.25em] text-cyan-400 uppercase mb-3 font-semibold">
                    Optics Module
                  </span>
                  <h2 className="font-outfit text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 uppercase leading-tight">
                    Upgrade your vision.
                  </h2>
                  <p className="font-sans text-sm md:text-base text-zinc-400 mb-4 leading-relaxed">
                    Snap in a new camera module anytime. Scale from everyday snap-shots to pro-grade cine photography.
                  </p>
                  <p className="font-sans text-xs md:text-sm text-zinc-500 leading-relaxed">
                    Hot-swappable mounts automatically sync with core ISP modules in milliseconds.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* BATTERY PHASE (60% - 80%) */}
            <AnimatePresence>
              {activePhase === "battery" && (
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-y-0 left-6 md:left-24 flex flex-col justify-center max-w-md pointer-events-auto"
                >
                  <span className="font-mono text-[10px] tracking-[0.25em] text-blue-500 uppercase mb-3 font-semibold">
                    Power Cells
                  </span>
                  <h2 className="font-outfit text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 uppercase leading-tight">
                    Power that adapts.
                  </h2>
                  <p className="font-sans text-sm md:text-base text-zinc-400 mb-4 leading-relaxed">
                    Replace your battery in seconds without powering down. Keep extra blocks in your pocket.
                  </p>
                  <p className="font-sans text-xs md:text-sm text-zinc-500 leading-relaxed">
                    Stay fully charged and secure 100% capacity over years of usage. Zero e-waste.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* REASSEMBLY / CTA PHASE (80% - 100%) */}
            <AnimatePresence>
              {activePhase === "cta" && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-auto"
                >
                  <span className="font-mono text-xs tracking-[0.4em] text-cyan-400 uppercase mb-4 font-semibold">
                    Integrated System
                  </span>
                  <h2 className="font-outfit text-4xl md:text-7xl font-bold tracking-tight text-white mb-4 uppercase leading-none">
                    Technology that evolves.
                  </h2>
                  <p className="font-sans text-base md:text-xl text-zinc-400 mb-10 max-w-xl">
                    Block Phone — the future is modular. Snapped together. Fully integrated.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button
                      onClick={scrollToSpecs}
                      className="px-8 py-3.5 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg glow-cyan hover:scale-[1.03] transition-all duration-300"
                    >
                      Explore Technical Specifications
                    </button>
                    <button
                      onClick={scrollToSpecs}
                      className="px-8 py-3.5 rounded-full text-sm font-semibold border border-white/20 text-white hover:bg-white/5 transition-colors duration-300"
                    >
                      View Specs
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </>
  );
}
