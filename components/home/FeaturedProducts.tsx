'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Product {
  _id: string;
  name: string;
  price: number;
  salePrice?: number;
  images: string[];
  slug: string;
  category: string;
  rating?: number;
  reviewCount?: number;
}

// ─── Demo Data (fallback) ──────────────────────────────────────────────────────
const DEMO_PRODUCTS: Product[] = [
  {
    _id: 'fp1',
    name: 'Premium Jamdani Saree — White & Gold',
    price: 5500,
    salePrice: 4400,
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80'],
    slug: 'premium-jamdani-saree-white-gold',
    category: 'Clothes',
    rating: 4.8,
    reviewCount: 42,
  },
  {
    _id: 'fp2',
    name: 'Handwoven Jute Basket Set',
    price: 1200,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80'],
    slug: 'handwoven-jute-basket-set',
    category: 'Crafts',
    rating: 4.6,
    reviewCount: 28,
  },
  {
    _id: 'fp3',
    name: 'Embroidered Silk Panjabi',
    price: 3200,
    salePrice: 2560,
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&q=80'],
    slug: 'embroidered-silk-panjabi',
    category: 'Clothes',
    rating: 4.9,
    reviewCount: 65,
  },
  {
    _id: 'fp4',
    name: 'Nakshikatha Embroidery Wall Piece',
    price: 2800,
    images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&q=80'],
    slug: 'nakshikatha-wall-piece',
    category: 'Crafts',
    rating: 4.7,
    reviewCount: 19,
  },
  {
    _id: 'fp5',
    name: 'Floral Block-Print Kurti',
    price: 980,
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4b4f28?w=500&q=80'],
    slug: 'floral-block-print-kurti',
    category: 'Clothes',
    rating: 4.5,
    reviewCount: 33,
  },
  {
    _id: 'fp6',
    name: 'Hand-Painted Terracotta Pot',
    price: 650,
    images: ['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500&q=80'],
    slug: 'hand-painted-terracotta-pot',
    category: 'Crafts',
    rating: 4.4,
    reviewCount: 15,
  },
  {
    _id: 'fp7',
    name: 'Muslin Salwar Kameez Set',
    price: 2200,
    salePrice: 1760,
    images: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500&q=80'],
    slug: 'muslin-salwar-kameez-set',
    category: 'Clothes',
    rating: 4.7,
    reviewCount: 51,
  },
  {
    _id: 'fp8',
    name: 'Bamboo Woven Lampshade',
    price: 1500,
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80'],
    slug: 'bamboo-woven-lampshade',
    category: 'Crafts',
    rating: 4.3,
    reviewCount: 11,
  },
];

const TABS = ['All', 'Clothes', 'Crafts'] as const;
type Tab = (typeof TABS)[number];

// ─── Skeleton ──────────────────────────────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-card border border-gray-100 animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-9 bg-gray-100 rounded-xl mt-3" />
      </div>
    </div>
  );
}

// ─── Star Rating ───────────────────────────────────────────────────────────────
function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1 mt-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`w-3 h-3 ${star <= Math.round(rating) ? 'fill-gold-500 text-gold-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
      <span className="text-xs text-gray-400">({count})</span>
    </div>
  );
}

// ─── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
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

  const discountPct =
    product.salePrice
      ? Math.round((1 - product.salePrice / product.price) * 100)
      : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl overflow-hidden bg-white shadow-card hover:shadow-product-hover border border-gray-100 group transition-shadow duration-300"
    >
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {discountPct && (
          <span className="absolute top-2 left-2 bg-primary-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{discountPct}%
          </span>
        )}
        <button
          onClick={(e) => { e.preventDefault(); setWished((w) => !w); }}
          className="absolute top-2 right-2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-all duration-200"
          aria-label="Wishlist"
        >
          <FiHeart className={`w-4 h-4 ${wished ? 'fill-primary-600 text-primary-600' : 'text-gray-600'}`} />
        </button>
      </Link>

      {/* Info */}
      <div className="p-3 sm:p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        {product.rating && <StarRating rating={product.rating} count={product.reviewCount ?? 0} />}
        <div className="flex items-baseline gap-2 mt-2 mb-3">
          <span className="text-primary-600 font-bold">
            ৳{(product.salePrice ?? product.price).toLocaleString()}
          </span>
          {product.salePrice && (
            <span className="text-xs text-gray-400 line-through">
              ৳{product.price.toLocaleString()}
            </span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 ${
            added
              ? 'bg-green-500 text-white'
              : 'bg-primary-600 hover:bg-primary-700 text-white'
          }`}
        >
          <FiShoppingCart className="w-4 h-4" />
          {added ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
interface FeaturedProductsProps {
  products?: Product[];
  loading?: boolean;
}

export default function FeaturedProducts({ products, loading = false }: FeaturedProductsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const displayProducts = products?.length ? products : DEMO_PRODUCTS;

  const filteredProducts =
    activeTab === 'All'
      ? displayProducts
      : displayProducts.filter((p) => p.category === activeTab);

  return (
    <section className="py-12 md:py-16 bg-white" aria-label="Featured Products">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header with gold underline decoration */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 inline-block relative">
            Featured Products
            {/* Gold underline */}
            <span
              className="block absolute -bottom-2 left-0 right-0 h-1 rounded-full"
              style={{ background: 'linear-gradient(90deg, #D4A017, #C41E3A)' }}
            />
          </h2>
          <p className="text-gray-500 mt-5 text-sm sm:text-base max-w-md mx-auto">
            Handpicked favourites — quality you can trust
          </p>
        </motion.div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-100 rounded-full p-1 gap-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-primary-600 text-white shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* View All */}
        <div className="text-center mt-10">
          <Link
            href="/products?featured=true"
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-primary-600 text-primary-600 font-bold rounded-full hover:bg-primary-600 hover:text-white transition-all duration-200 group"
          >
            View All Featured
            <span className="transition-transform group-hover:translate-x-1 duration-200">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
