"use client";

import { useEffect, useRef, useState } from "react";
import { MotionValue, useMotionValueEvent } from "framer-motion";

interface HuracanScrollCanvasProps {
  scrollYProgress: MotionValue<number>;
  totalFrames: number;
  imageFolderPath: string;
}

export default function HuracanScrollCanvas({
  scrollYProgress,
  totalFrames,
  imageFolderPath,
}: HuracanScrollCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const animFrameRef = useRef<number | null>(null);

  // Preload all frames on mount
  useEffect(() => {
    let loadedCount = 0;
    let timeoutId: NodeJS.Timeout | null = null;
    const tempImages: HTMLImageElement[] = [];

    const completeLoading = () => {
      imagesRef.current = tempImages;
      setImagesLoaded(true);
      if (timeoutId) clearTimeout(timeoutId);
    };

    // Pre-populate the array to avoid race conditions with cached image loading
    for (let i = 0; i < totalFrames; i++) {
      tempImages[i] = new Image();
      tempImages[i].crossOrigin = "anonymous";
    }

    for (let i = 0; i < totalFrames; i++) {
      const img = tempImages[i];
      const frameName = `ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`;
      
      img.onload = () => {
        loadedCount++;
        const percent = Math.floor((loadedCount / totalFrames) * 100);
        setLoadProgress(percent);
        
        if (loadedCount === totalFrames) {
          completeLoading();
        }
      };
      
      img.onerror = () => {
        console.error(`Failed to load frame: ${frameName}`);
        loadedCount++;
        
        if (loadedCount === totalFrames) {
          completeLoading();
        }
      };

      // Set src after events are hooked up and slot is allocated in the array
      img.src = `${imageFolderPath}/${frameName}`;
    }

    // Fallback timeout - complete loading after 10 seconds even if images haven't all loaded
    timeoutId = setTimeout(() => {
      console.warn(`Image loading timeout after 10 seconds. Loaded ${loadedCount}/${totalFrames} frames.`);
      setLoadError(true);
      setLoadProgress(100);
      completeLoading();
    }, 10000);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [totalFrames, imageFolderPath]);

  // Object-fit contain logic to render frame inside canvas
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img || !img.complete) return;

    // Ensure smoothing is active on context (resets can occur on clearing/size changes)
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Clear previous drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.width;
    const imgHeight = img.height;

    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
      // Image is wider than canvas ratio
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgRatio;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      // Image is taller than canvas ratio
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * imgRatio;
      offsetX = (canvasWidth - drawWidth) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // Redraw and scale canvas when container sizes change (using ResizeObserver to avoid 0px layout bugs)
  useEffect(() => {
    if (!imagesLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (let entry of entries) {
        const width = entry.contentRect.width || canvas.clientWidth || window.innerWidth;
        const height = entry.contentRect.height || canvas.clientHeight || window.innerHeight;
        const dpr = window.devicePixelRatio || 1;

        canvas.width = width * dpr;
        canvas.height = height * dpr;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
        }

        // Force redraw current frame at new size (reaches final frame at 92% scroll for cushion)
        const currentProgress = scrollYProgress.get();
        const progress = Math.min(1, currentProgress / 0.92);
        const index = Math.min(
          totalFrames - 1,
          Math.floor(progress * totalFrames)
        );
        drawFrame(index);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
    };
  }, [imagesLoaded, totalFrames, scrollYProgress]);

  // Listen to scrollYProgress and trigger redraw (reaches final frame at 92% scroll for cushion)
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!imagesLoaded) return;

    const progress = Math.min(1, latest / 0.92);
    const index = Math.min(totalFrames - 1, Math.floor(progress * totalFrames));

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    animFrameRef.current = requestAnimationFrame(() => {
      drawFrame(index);
    });
  });

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[#1a1a1a]">
      {/* Canvas Element */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block select-none pointer-events-none"
        style={{ width: "100%", height: "100%" }}
      />

      {/* Loading Overlay */}
      {!imagesLoaded && (
        <div className="absolute inset-0 bg-[#1a1a1a] flex flex-col items-center justify-center z-20">
          {loadError ? (
            <div className="text-center space-y-4">
              <div className="font-heading text-sm tracking-[0.25em] text-brand-blue/60 uppercase">
                ⚠ LOAD ERROR
              </div>
              <div className="max-w-md px-4 font-body text-xs text-white/40 leading-relaxed">
                Unable to load all sequence frames. Some images may be unavailable.
              </div>
              <div className="font-heading text-[10px] tracking-widest text-white/30 uppercase mt-4">
                Attempting to proceed...
              </div>
            </div>
          ) : (
            <>
              <div className="relative w-72 h-1 bg-white/10 rounded-full overflow-hidden border border-white/5">
                <div
                  className="absolute left-0 top-0 h-full bg-brand-blue shadow-[0_0_10px_rgba(0,136,255,0.8)] transition-all duration-300 ease-out"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>
              <div className="mt-4 font-heading text-xs tracking-[0.25em] text-white/50 uppercase">
                CALIBRATING NEURAL INTERFACE... {loadProgress}%
              </div>
              <div className="mt-1 font-body text-[10px] tracking-widest text-brand-blue uppercase animate-pulse">
                LOADING BLUE HURACÁN SEQUENCE
              </div>
            </>
          )}
        </div>
      )}

      {/* Sci-fi HUD grid border accents */}
      {imagesLoaded && (
        <div className="absolute inset-0 pointer-events-none border border-brand-blue/10 m-6 flex flex-col justify-between">
          <div className="flex justify-between p-2">
            <span className="font-heading text-[9px] text-brand-blue/40 tracking-wider">
              SYS.ACTIVE: SEQ_0104
            </span>
            <span className="font-heading text-[9px] text-brand-blue/40 tracking-wider">
              LDF.7SPD // ACTIVE_AWD
            </span>
          </div>
          <div className="flex justify-between p-2">
            <span className="font-heading text-[9px] text-brand-blue/40 tracking-wider">
              LAT: 43.8015° N // LON: 11.1303° E
            </span>
            <span className="font-heading text-[9px] text-brand-blue/40 tracking-wider">
              SANT'AGATA BOLOGNESE
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
