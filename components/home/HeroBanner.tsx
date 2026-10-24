'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Swiper CSS
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// ─── Slide Data ───────────────────────────────────────────────────────────────
const slides = [
  {
    id: 1,
    headline: 'Discover Authentic Handloom Sarees',
    subtitle: 'Woven with tradition, draped in elegance. Explore our curated jamdani & muslin collection.',
    cta: 'Shop Now',
    href: '/products?category=sarees',
    bgClass: 'from-rose-100 via-pink-50 to-amber-50',
    textSide: 'left' as const,
    accentColor: '#C41E3A',
    image: {
      src: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
      alt: 'Handloom Saree',
    },
    badge: 'New Collection',
    overlay: 'bg-gradient-to-r from-rose-900/10 to-transparent',
  },
  {
    id: 2,
    headline: 'Homemade Crafts with Love',
    subtitle: 'Artisan-crafted jute bags, pottery, and wall art — each piece tells a story.',
    cta: 'Explore Crafts',
    href: '/products?category=jute-crafts',
    bgClass: 'from-amber-100 via-orange-50 to-yellow-50',
    textSide: 'left' as const,
    accentColor: '#D4A017',
    image: {
      src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      alt: 'Homemade Crafts',
    },
    badge: 'Artisan Pick',
    overlay: 'bg-gradient-to-r from-amber-900/10 to-transparent',
  },
  {
    id: 3,
    headline: 'New Collection — Eid Special',
    subtitle: 'Celebrate with our exclusive Eid collection. Premium panjabi, kurti & salwar sets.',
    cta: 'Shop Eid Collection',
    href: '/products?tag=eid-special',
    bgClass: 'from-primary-600 via-primary-700 to-primary-800',
    textSide: 'left' as const,
    accentColor: '#D4A017',
    image: {
      src: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80',
      alt: 'Eid Special Collection',
    },
    badge: '🌙 Eid Special',
    overlay: 'bg-gradient-to-r from-black/20 to-transparent',
    darkText: true,
  },
];

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function HeroBannerSkeleton() {
  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] bg-gray-200 animate-shimmer overflow-hidden rounded-none">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function HeroBanner() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <HeroBannerSkeleton />;
  }

  const isLightSlide = (idx: number) => !slides[idx].darkText;

  return (
    <section className="relative w-full overflow-hidden" aria-label="Hero Banner">
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true, el: '.hero-dots' }}
        loop
        speed={800}
        onSwiper={(swiper) => { swiperRef.current = swiper; setMounted(true); }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="w-full h-[60vh] sm:h-[70vh] md:h-[85vh] lg:h-[90vh]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className={`relative w-full h-full bg-gradient-to-br ${slide.bgClass}`}>
              {/* Overlay */}
              <div className={`absolute inset-0 ${slide.overlay}`} />

              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={slide.image.src}
                  alt={slide.image.alt}
                  fill
                  className="object-cover object-center opacity-30 md:opacity-50"
                  priority={slide.id === 1}
                  sizes="100vw"
                />
                {/* Gradient overlay on image */}
                <div className={`absolute inset-0 ${slide.darkText
                  ? 'bg-gradient-to-r from-primary-700/80 via-primary-700/40 to-transparent'
                  : 'bg-gradient-to-r from-white/70 via-white/30 to-transparent'
                }`} />
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="max-w-2xl mx-auto text-center md:mx-0 md:text-left">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={slide.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      >
                        {/* Badge */}
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 tracking-widest uppercase"
                          style={{
                            background: slide.accentColor,
                            color: '#fff',
                          }}
                        >
                          {slide.badge}
                        </span>

                        {/* Headline */}
                        <h1
                          className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 ${
                            slide.darkText ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {slide.headline}
                        </h1>

                        {/* Subtitle */}
                        <p
                          className={`text-base sm:text-lg md:text-xl mb-8 leading-relaxed max-w-lg mx-auto md:mx-0 ${
                            slide.darkText ? 'text-rose-100' : 'text-gray-600'
                          }`}
                        >
                          {slide.subtitle}
                        </p>

                        {/* CTA */}
                        <Link
                          href={slide.href}
                          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-base transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                          style={{
                            background: slide.accentColor,
                            color: '#fff',
                            boxShadow: `0 4px 20px ${slide.accentColor}60`,
                          }}
                        >
                          {slide.cta}
                          <FiChevronRight className="w-5 h-5" />
                        </Link>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Arrows */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
        aria-label="Previous slide"
      >
        <FiChevronLeft className="w-5 h-5 text-gray-700" />
      </button>
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
        aria-label="Next slide"
      >
        <FiChevronRight className="w-5 h-5 text-gray-700" />
      </button>

      {/* Custom Dots */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 hero-dots" />

      {/* Slide Counter */}
      <div className="absolute bottom-4 md:bottom-6 right-4 md:right-8 z-20 text-white/70 text-sm font-medium tabular-nums">
        {activeIndex + 1} / {slides.length}
      </div>

      {/* Bottom gradient for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/30 to-transparent z-10 pointer-events-none" />
    </section>
  );
}
