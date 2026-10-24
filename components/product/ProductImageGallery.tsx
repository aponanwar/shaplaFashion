'use client';

// components/product/ProductImageGallery.tsx
// Main image with thumbnail strip, hover zoom, and mobile swipe gestures.

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

// ─── Thumbnail ──────────────────────────────────────────────────────────────────

function Thumbnail({
  src,
  alt,
  isActive,
  onClick,
}: {
  src: string;
  alt: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={alt}
      className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
        isActive
          ? 'border-[#C41E3A] shadow-md ring-2 ring-[#C41E3A]/30'
          : 'border-gray-200 hover:border-[#C41E3A]/60'
      }`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="80px"
        className="object-cover"
      />
    </button>
  );
}

// ─── ProductImageGallery ────────────────────────────────────────────────────────

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 }); // percent

  // Touch swipe state
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const safeImages = images.length > 0 ? images : ['/images/placeholder.jpg'];
  const total = safeImages.length;

  const prev = useCallback(() => {
    setActiveIdx((i) => (i === 0 ? total - 1 : i - 1));
  }, [total]);

  const next = useCallback(() => {
    setActiveIdx((i) => (i === total - 1 ? 0 : i + 1));
  }, [total]);

  // ── Hover zoom tracking ──
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  // ── Touch swipe ──
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Only trigger on predominantly horizontal swipe
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx < 0 ? next() : prev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div className="flex flex-col gap-3">
      {/* ── Main Image ── */}
      <div
        className="relative aspect-square sm:aspect-[4/5] w-full rounded-2xl overflow-hidden bg-gray-50 cursor-zoom-in select-none"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            <div
              className="w-full h-full transition-transform duration-200 ease-out"
              style={
                zoomed
                  ? {
                      transform: 'scale(1.5)',
                      transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                    }
                  : { transform: 'scale(1)', transformOrigin: 'center center' }
              }
            >
              <Image
                src={safeImages[activeIdx]}
                alt={`${productName} – image ${activeIdx + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority={activeIdx === 0}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next arrows */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 backdrop-blur shadow hover:bg-white transition-colors"
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 backdrop-blur shadow hover:bg-white transition-colors"
            >
              <FiChevronRight size={18} />
            </button>
          </>
        )}

        {/* Dot indicators (mobile) */}
        {total > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 sm:hidden">
            {safeImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === activeIdx ? 'bg-[#C41E3A] w-4' : 'bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Thumbnail Strip (desktop) ── */}
      {total > 1 && (
        <div className="hidden sm:flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-200">
          {safeImages.map((src, i) => (
            <Thumbnail
              key={i}
              src={src}
              alt={`${productName} thumbnail ${i + 1}`}
              isActive={i === activeIdx}
              onClick={() => setActiveIdx(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
