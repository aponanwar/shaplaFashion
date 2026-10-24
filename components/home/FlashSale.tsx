'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';

// ─── Types ─────────────────────────────────────────────────────────────────────
interface FlashProduct {
  _id: string;
  name: string;
  price: number;
  salePrice?: number;
  images: string[];
  slug: string;
  discount?: number;
  stock: number;
}

// ─── Mock / demo data (replaced by API data when available) ───────────────────
const DEMO_PRODUCTS: FlashProduct[] = [
  {
    _id: '1',
    name: 'Jamdani Saree — Heritage Weave',
    price: 3500,
    salePrice: 2450,
    discount: 30,
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80'],
    slug: 'jamdani-saree-heritage',
    stock: 5,
  },
  {
    _id: '2',
    name: 'Cotton Panjabi — Eid Edition',
    price: 1800,
    salePrice: 1260,
    discount: 30,
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&q=80'],
    slug: 'cotton-panjabi-eid',
    stock: 8,
  },
  {
    _id: '3',
    name: 'Jute Shoulder Bag — Handcrafted',
    price: 950,
    salePrice: 665,
    discount: 30,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80'],
    slug: 'jute-shoulder-bag',
    stock: 12,
  },
  {
    _id: '4',
    name: 'Block Print Kurti — Summer',
    price: 1200,
    salePrice: 840,
    discount: 30,
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4b4f28?w=400&q=80'],
    slug: 'block-print-kurti',
    stock: 7,
  },
  {
    _id: '5',
    name: 'Nakshikatha Wall Tapestry',
    price: 2200,
    salePrice: 1540,
    discount: 30,
    images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80'],
    slug: 'nakshikatha-tapestry',
    stock: 3,
  },
  {
    _id: '6',
    name: 'Muslin Salwar Kameez Set',
    price: 2800,
    salePrice: 1960,
    discount: 30,
    images: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&q=80'],
    slug: 'muslin-salwar-kameez',
    stock: 6,
  },
];

// ─── Countdown Hook ────────────────────────────────────────────────────────────
function useCountdown(targetHours = 24) {
  // Static initial values to prevent SSR hydration mismatch
  const [timeLeft, setTimeLeft] = useState({
    h: 12,
    m: 45,
    s: 30,
  });

  useEffect(() => {
    const target = Date.now() + targetHours * 3600 * 1000;
    const updateCountdown = () => {
      const diff = Math.max(0, target - Date.now());
      setTimeLeft({
        h: Math.floor(diff / 3_600_000) % 24,
        m: Math.floor(diff / 60_000) % 60,
        s: Math.floor(diff / 1_000) % 60,
      });
    };

    updateCountdown();
    const id = setInterval(updateCountdown, 1000);
    return () => clearInterval(id);
  }, [targetHours]);

  return timeLeft;
}

// ─── Countdown Block ───────────────────────────────────────────────────────────
function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        suppressHydrationWarning
        className="bg-gray-900 text-white rounded-md w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg sm:text-xl font-extrabold tabular-nums"
      >
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-[10px] sm:text-xs text-gray-500 mt-1 uppercase tracking-wider">{label}</span>
    </div>
  );
}

// ─── Product Card Skeleton ─────────────────────────────────────────────────────
function FlashProductSkeleton() {
  return (
    <div className="min-w-[180px] sm:min-w-[210px] w-[180px] sm:w-[210px] flex-shrink-0 rounded-2xl overflow-hidden bg-white shadow-card border border-gray-100 animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-8 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

// ─── Single Product Card ───────────────────────────────────────────────────────
function FlashProductCard({ product }: { product: FlashProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      name: product.name,
      price: product.salePrice ?? product.price,
      image: product.images[0],
      slug: product.slug,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discountPct = product.discount ?? Math.round((1 - (product.salePrice ?? product.price) / product.price) * 100);

  return (
    <div className="min-w-[180px] sm:min-w-[210px] w-[180px] sm:w-[210px] flex-shrink-0 rounded-2xl overflow-hidden bg-white shadow-card hover:shadow-product-hover border border-gray-100 transition-shadow duration-300 group">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="relative block h-48 overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="210px"
        />
        {/* Discount badge */}
        {discountPct > 0 && (
          <span className="absolute top-2 left-2 bg-primary-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{discountPct}%
          </span>
        )}
        {/* Stock warning */}
        {product.stock <= 5 && (
          <span className="absolute bottom-2 left-2 bg-amber-500/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
            Only {product.stock} left!
          </span>
        )}
        {/* Wishlist button */}
        <button
          onClick={(e) => { e.preventDefault(); setWished((w) => !w); }}
          className="absolute top-2 right-2 w-7 h-7 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow transition-all duration-200 opacity-0 group-hover:opacity-100"
          aria-label="Add to wishlist"
        >
          <FiHeart className={`w-3.5 h-3.5 ${wished ? 'fill-primary-600 text-primary-600' : 'text-gray-600'}`} />
        </button>
      </Link>

      {/* Info */}
      <div className="p-3">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        {/* Pricing */}
        <div className="flex items-baseline gap-2 mt-1.5 mb-2.5">
          <span className="text-primary-600 font-bold text-base">
            ৳{(product.salePrice ?? product.price).toLocaleString()}
          </span>
          {product.salePrice && (
            <span className="text-gray-400 text-xs line-through">
              ৳{product.price.toLocaleString()}
            </span>
          )}
        </div>
        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
            added
              ? 'bg-green-500 text-white'
              : 'bg-primary-600 hover:bg-primary-700 text-white active:scale-95'
          }`}
        >
          <FiShoppingCart className="w-3.5 h-3.5" />
          {added ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
interface FlashSaleProps {
  products?: FlashProduct[];
  loading?: boolean;
}

export default function FlashSale({ products, loading = false }: FlashSaleProps) {
  const { h, m, s } = useCountdown(23);
  const displayProducts = products?.length ? products : DEMO_PRODUCTS;

  return (
    <section className="py-10 md:py-14 bg-gray-50" aria-label="Flash Sale">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* Title + timer */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label="flame">🔥</span>
              <motion.h2
                className="text-xl sm:text-2xl font-extrabold text-primary-600"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                Flash Sale
              </motion.h2>
            </div>
            {/* Countdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 font-medium mr-1 hidden sm:inline">Ends in</span>
              <CountdownBlock value={h} label="hrs" />
              <span className="text-gray-400 font-bold text-lg mb-3.5">:</span>
              <CountdownBlock value={m} label="min" />
              <span className="text-gray-400 font-bold text-lg mb-3.5">:</span>
              <CountdownBlock value={s} label="sec" />
            </div>
          </div>

          {/* View all */}
          <Link
            href="/products?tag=flash-sale"
            className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1 group"
          >
            View All
            <span className="transition-transform group-hover:translate-x-1 duration-200">→</span>
          </Link>
        </div>

        {/* Horizontal scroll product strip */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          <div className="flex gap-3 sm:gap-4 w-max sm:w-full sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:w-auto">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <FlashProductSkeleton key={i} />)
              : displayProducts.map((p) => (
                  <FlashProductCard key={p._id} product={p} />
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
