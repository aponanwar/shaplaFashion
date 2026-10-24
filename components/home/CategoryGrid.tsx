'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// ─── Category Data ─────────────────────────────────────────────────────────────
const categories = [
  {
    name: 'Sarees',
    slug: 'sarees',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
    count: '120+ styles',
    emoji: '🥻',
  },
  {
    name: 'Panjabi',
    slug: 'panjabi',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80',
    count: '80+ styles',
    emoji: '👔',
  },
  {
    name: 'Kurti',
    slug: 'kurti',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4f28?w=600&q=80',
    count: '95+ styles',
    emoji: '👗',
  },
  {
    name: 'Salwar Kameez',
    slug: 'salwar-kameez',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80',
    count: '70+ styles',
    emoji: '👘',
  },
  {
    name: 'Jute Crafts',
    slug: 'jute-crafts',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    count: '45+ items',
    emoji: '🪡',
  },
  {
    name: 'Wall Art',
    slug: 'wall-art',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80',
    count: '60+ pieces',
    emoji: '🎨',
  },
];

// ─── Skeleton ──────────────────────────────────────────────────────────────────
function CategoryGridSkeleton() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title skeleton */}
        <div className="text-center mb-10">
          <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-3 animate-pulse" />
          <div className="h-4 w-72 bg-gray-100 rounded mx-auto animate-pulse" />
        </div>
        {/* Grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Category Card ─────────────────────────────────────────────────────────────
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
};

function CategoryCard({ cat, index }: { cat: (typeof categories)[0]; index: number }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      <Link
        href={`/products?category=${cat.slug}`}
        className="group relative block overflow-hidden rounded-2xl aspect-[3/4] shadow-card hover:shadow-product-hover transition-shadow duration-300"
        aria-label={`Browse ${cat.name}`}
      >
        {/* Image */}
        <Image
          src={cat.image}
          alt={cat.name}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
        />

        {/* Gradient overlay (always present, subtle) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Hover overlay with primary color */}
        <div className="absolute inset-0 bg-primary-600/0 group-hover:bg-primary-600/40 transition-all duration-400" />

        {/* Lift effect border */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-500/60 rounded-2xl transition-all duration-300" />

        {/* Text content */}
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-lg leading-none">{cat.emoji}</span>
            <span className="font-bold text-sm md:text-base truncate">{cat.name}</span>
          </div>
          <p className="text-xs text-white/70 group-hover:text-white/90 transition-colors">{cat.count}</p>
        </div>

        {/* Hover CTA chip */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-white text-primary-600 text-xs font-semibold px-2.5 py-1 rounded-full">
            View All
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function CategoryGrid() {
  return (
    <section className="py-12 md:py-16 bg-white" aria-label="Shop by Category">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
            Shop by Category
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
            Explore our curated collection of authentic Bangladeshi fashion and crafts
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.slug} cat={cat} index={i} />
          ))}
        </div>

        {/* View All link */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors group"
          >
            View All Categories
            <span className="transition-transform group-hover:translate-x-1 duration-200">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// Export skeleton for Suspense
export { CategoryGridSkeleton };
