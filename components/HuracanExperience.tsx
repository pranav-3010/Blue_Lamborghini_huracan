"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, MotionValue, useMotionValueEvent } from "framer-motion";
import { SCROLL_PHASES } from "@/data/carData";

interface HuracanExperienceProps {
  scrollYProgress: MotionValue<number>;
}

type PhaseType = "hero" | "design" | "engine";

export default function HuracanExperience({ scrollYProgress }: HuracanExperienceProps) {
  const [phase, setPhase] = useState<PhaseType>("hero");

  // DOM Refs for high-performance direct telemetry updates (prevents React re-render lags)
  const speedValRef = useRef<HTMLSpanElement>(null);
  const rpmValRef = useRef<HTMLSpanElement>(null);
  const gearValRef = useRef<HTMLSpanElement>(null);
  const throttleBarRef = useRef<HTMLDivElement>(null);
  const gForceXRef = useRef<HTMLSpanElement>(null);
  const gForceYRef = useRef<HTMLSpanElement>(null);

  // Monitor scroll for phase transitions and telemetry calculations
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Normalize progress based on the 92% scroll animation limit (cushion at the end)
    const progress = Math.min(1, latest / 0.92);

    // 1. Update Phase based on normalized progress
    if (progress < 0.33) {
      if (phase !== "hero") setPhase("hero");
    } else if (progress >= 0.33 && progress < 0.66) {
      if (phase !== "design") setPhase("design");
    } else {
      if (phase !== "engine") setPhase("engine");
    }

    // 2. Calculate Telemetry (Speed 0 to 325 km/h, RPM 1000 to 8500, Gear 1 to 7) using normalized progress
    const speed = Math.floor(progress * 325);
    const rpm = Math.floor(1000 + progress * 7500);
    const gear = progress === 0 ? "P" : progress < 0.05 ? "N" : String(Math.min(7, Math.floor((progress - 0.05) * 8.5) + 1));
    const throttle = Math.floor(progress * 100);
    
    // Simulate slight lateral/longitudinal G-forces
    const gx = (Math.sin(progress * Math.PI * 4) * 0.4).toFixed(2);
    const gy = (0.2 + progress * 1.3).toFixed(2);

    if (speedValRef.current) speedValRef.current.textContent = String(speed);
    if (rpmValRef.current) rpmValRef.current.textContent = String(rpm);
    if (gearValRef.current) gearValRef.current.textContent = gear;
    if (throttleBarRef.current) throttleBarRef.current.style.width = `${throttle}%`;
    if (gForceXRef.current) gForceXRef.current.textContent = gx;
    if (gForceYRef.current) gForceYRef.current.textContent = gy;
  });

  const activeContent = SCROLL_PHASES[phase];

  return (
    <div className="absolute inset-0 z-10 pointer-events-none select-none flex flex-col justify-between p-8 font-body">
      
      {/* 1. TOP CORNER METRICS (Fixed) */}
      <div className="w-full flex justify-between items-start mt-16">
        {/* Top Left: System Telemetry */}
        <div className="hud-bg hud-border p-4 rounded text-left border-brand-blue/30 shadow-[0_0_15px_rgba(0,136,255,0.05)]">
          <div className="text-[10px] text-brand-blue tracking-[0.2em] font-heading font-semibold uppercase">
            TELEMETRY MATRIX
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs">
            <div className="text-white/40">LATERAL G-FORCE:</div>
            <div className="text-white font-mono"><span ref={gForceXRef}>0.00</span> G</div>
            
            <div className="text-white/40">LONG. G-FORCE:</div>
            <div className="text-white font-mono"><span ref={gForceYRef}>0.20</span> G</div>

            <div className="text-white/40">SUSPENSION DEFI:</div>
            <div className="text-white font-mono">ACTIVE</div>
          </div>
        </div>

        {/* Top Right: System Status */}
        <div className="hud-bg hud-border p-4 rounded text-right border-brand-blue/30 shadow-[0_0_15px_rgba(0,136,255,0.05)]">
          <div className="text-[10px] text-brand-blue tracking-[0.2em] font-heading font-semibold uppercase">
            DRIVE MODULE
          </div>
          <div className="mt-2 text-xs">
            <span className="text-white font-mono mr-2">C O R S A</span>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-brand-blue animate-pulse shadow-[0_0_8px_#0088ff]" />
          </div>
          <div className="text-[9px] text-white/40 mt-1 uppercase">
            ESC: SPORT // LIFT: OFF
          </div>
        </div>
      </div>

      {/* 2. CENTRAL HUD CROSSHAIR GRAPHIC */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/5 rounded-full flex items-center justify-center pointer-events-none">
        <div className="w-40 h-40 border border-brand-blue/15 border-dashed rounded-full flex items-center justify-center">
          <div className="w-12 h-12 border border-brand-blue/30 rounded-full relative">
            {/* Center dots/lines */}
            <div className="absolute top-1/2 left-0 w-3 h-0.5 bg-brand-blue/50 -translate-y-1/2" />
            <div className="absolute top-1/2 right-0 w-3 h-0.5 bg-brand-blue/50 -translate-y-1/2" />
            <div className="absolute left-1/2 top-0 w-0.5 h-3 bg-brand-blue/50 -translate-x-1/2" />
            <div className="absolute left-1/2 bottom-0 w-0.5 h-3 bg-brand-blue/50 -translate-x-1/2" />
          </div>
        </div>
        {/* Dynamic bracket corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-brand-blue/40" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-brand-blue/40" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-brand-blue/40" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-brand-blue/40" />
      </div>

      {/* 3. DYNAMIC CONTENT CARD (Transitions strictly based on Phase) */}
      <div className="w-full flex md:flex-row flex-col items-center justify-between gap-6 my-auto z-20">
        <AnimatePresence mode="wait">
          {phase === "hero" && (
            <motion.div
              key="hero-overlay"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="hud-bg hud-border p-8 rounded-lg max-w-lg border-brand-blue/40 shadow-[0_0_30px_rgba(0,136,255,0.1)] text-left"
            >
              <div className="text-[11px] text-brand-blue tracking-[0.3em] font-heading font-semibold uppercase">
                {activeContent.subtitle}
              </div>
              <h2 className="text-4xl font-extrabold text-white mt-2 leading-none font-heading text-glow">
                BLUE LAMBORGHINI
                <br />
                <span className="text-brand-blue text-glow-blue">HURACÁN</span>
              </h2>
              <p className="text-sm text-gray-300 mt-4 leading-relaxed font-light">
                {activeContent.description}
              </p>
              
              <div className="mt-6 flex flex-wrap gap-4 items-center">
                {activeContent.metrics.map((m, idx) => (
                  <div key={idx} className="border-r border-white/10 pr-4 last:border-0">
                    <span className="block text-[10px] text-white/40 tracking-wider font-heading">{m.label}</span>
                    <span className="text-lg font-bold text-white font-heading font-mono">{m.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center space-x-4 pointer-events-auto">
                <button
                  onClick={() => document.getElementById("inquire")?.scrollIntoView({ behavior: "smooth" })}
                  className="px-6 py-2.5 bg-brand-blue hover:bg-brand-blue/80 text-white font-heading text-xs tracking-widest font-semibold rounded transition-colors shadow-[0_0_15px_rgba(0,136,255,0.4)] cursor-pointer"
                >
                  INQUIRE NOW
                </button>
                <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] flex items-center animate-pulse">
                  <span>Scroll to explore</span>
                  <svg className="w-3 h-3 ml-2 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>
            </motion.div>
          )}

          {phase === "design" && (
            <motion.div
              key="design-overlay"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="hud-bg hud-border p-8 rounded-lg max-w-lg border-brand-blue/40 shadow-[0_0_30px_rgba(0,136,255,0.1)] text-left"
            >
              <div className="text-[11px] text-brand-blue tracking-[0.3em] font-heading font-semibold uppercase">
                {activeContent.subtitle}
              </div>
              <h2 className="text-3xl font-extrabold text-white mt-2 leading-none font-heading">
                CARBON FIBER
                <br />
                <span className="text-brand-blue">MONOCOQUE</span>
              </h2>
              <p className="text-sm text-gray-300 mt-4 leading-relaxed font-light">
                {activeContent.description}
              </p>
              
              <ul className="mt-4 space-y-2 text-xs text-white/80">
                {activeContent.details.map((d, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-brand-blue rounded-full" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap gap-4 items-center">
                {activeContent.metrics.map((m, idx) => (
                  <div key={idx} className="border-r border-white/10 pr-4 last:border-0">
                    <span className="block text-[10px] text-white/40 tracking-wider font-heading">{m.label}</span>
                    <span className="text-lg font-bold text-brand-blue font-heading font-mono">{m.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {phase === "engine" && (
            <motion.div
              key="engine-overlay"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="hud-bg hud-border p-8 rounded-lg max-w-lg border-brand-blue/40 shadow-[0_0_30px_rgba(0,136,255,0.1)] text-left ml-auto"
            >
              <div className="text-[11px] text-brand-blue tracking-[0.3em] font-heading font-semibold uppercase">
                {activeContent.subtitle}
              </div>
              <div className="flex justify-between items-start mt-2">
                <h2 className="text-3xl font-extrabold text-white leading-none font-heading">
                  V12 ENGINE
                  <br />
                  <span className="text-brand-blue">PERFORMANCE</span>
                </h2>
                <div className="text-right">
                  <span className="block text-[10px] text-white/40 font-heading">SPECIFICATION</span>
                  <span className="text-2xl font-black text-brand-blue font-heading tracking-wide">V12 // 750HP</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-300 mt-4 leading-relaxed font-light">
                {activeContent.description}
              </p>

              <ul className="mt-4 space-y-2 text-xs text-white/80">
                {activeContent.details.map((d, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-brand-blue rounded-full" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap gap-4 items-center">
                {activeContent.metrics.map((m, idx) => (
                  <div key={idx} className="border-r border-white/10 pr-4 last:border-0">
                    <span className="block text-[10px] text-white/40 tracking-wider font-heading">{m.label}</span>
                    <span className="text-lg font-bold text-white font-heading font-mono">{m.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. BOTTOM TELEMETRY BAR (Fixed) */}
      <div className="w-full flex md:flex-row flex-col justify-between items-stretch gap-4 z-20 pointer-events-auto">
        {/* Live Gauges: Speed & RPM */}
        <div className="hud-bg hud-border p-4 rounded-lg flex-1 border-brand-blue/30 flex items-center justify-between min-w-[280px]">
          <div className="flex items-center space-x-4">
            <div>
              <span className="block text-[9px] text-white/40 uppercase tracking-widest font-heading">SPEED</span>
              <div className="flex items-baseline space-x-1">
                <span ref={speedValRef} className="text-4xl font-extrabold font-heading text-white font-mono">0</span>
                <span className="text-[10px] text-brand-blue tracking-widest font-semibold font-heading">KM/H</span>
              </div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <span className="block text-[9px] text-white/40 uppercase tracking-widest font-heading">RPM ENGINE</span>
              <div className="flex items-baseline space-x-1">
                <span ref={rpmValRef} className="text-2xl font-bold font-heading text-white font-mono">1000</span>
                <span className="text-[10px] text-brand-blue/70 tracking-widest font-heading">RPM</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-white/40 font-heading">GEAR</span>
            <div className="w-10 h-10 border border-brand-blue/50 rounded flex items-center justify-center bg-brand-blue-dark/20 text-xl font-bold text-brand-blue font-heading font-mono">
              <span ref={gearValRef}>P</span>
            </div>
          </div>
        </div>

        {/* Live Throttle and Brake Telemetry */}
        <div className="hud-bg hud-border p-4 rounded-lg flex-1 border-brand-blue/30 flex flex-col justify-center min-w-[280px]">
          <div className="flex justify-between items-center text-[10px] text-white/40 font-heading mb-2">
            <span>THROTTLE OUTPUT (SCROLL LINKED)</span>
            <span className="text-brand-blue">DPR 2.0x ENGAGED</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/5 relative">
            <div
              ref={throttleBarRef}
              className="absolute left-0 top-0 h-full bg-brand-blue shadow-[0_0_10px_rgba(0,136,255,0.8)] transition-all duration-100 ease-out"
              style={{ width: "0%" }}
            />
          </div>
          <div className="flex justify-between text-[8px] text-white/30 font-mono mt-1">
            <span>0% (STANDBY)</span>
            <span>50% (TORQUE_PEAK)</span>
            <span>100% (LIMIT_RPM)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
