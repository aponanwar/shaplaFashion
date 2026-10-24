'use client';

// components/product/ProductCard.tsx
// Displays a single product with hover effects, badges, rating, price, cart & wishlist actions.

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { formatCurrency, calculateDiscount } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProductCardProduct {
  id: string;
  name: string;
  slug: string;
  images: string[];
  price: number;
  discountPrice?: number;
  rating?: number;
  reviewCount?: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isOnSale?: boolean;
  stock: number;
  sizes?: string[];
  colors?: string[];
}

interface ProductCardProps {
  product: ProductCardProduct;
}

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={
              star <= Math.round(rating)
                ? 'text-[#D4A017] fill-[#D4A017]'
                : 'text-gray-300 fill-gray-200'
            }
            size={12}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500">({count})</span>
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function Badge({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] font-bold tracking-wide rounded-full text-white uppercase ${className}`}
    >
      {label}
    </span>
  );
}

// ─── ProductCard ──────────────────────────────────────────────────────────────

export default function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  const { addItem, openCart } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();

  const wishlisted = isWishlisted(product.id);
  const outOfStock = product.stock === 0;

  const primaryImage = product.images[0] ?? '/images/placeholder.jpg';
  const hoverImage = product.images[1] ?? primaryImage;

  const discountPct =
    product.discountPrice
      ? calculateDiscount(product.price, product.discountPrice)
      : 0;

  // Handle mouse events to swap image index
  const handleMouseEnter = () => {
    setHovered(true);
    if (product.images.length > 1) setImgIdx(1);
  };
  const handleMouseLeave = () => {
    setHovered(false);
    setImgIdx(0);
  };

  // Quick-add to cart (no size/color selection needed here)
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (outOfStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      image: primaryImage,
      price: product.price,
      discountPrice: product.discountPrice,
      quantity: 1,
      size: product.sizes?.[0],
      color: product.colors?.[0],
      sku: `${product.id}-default`,
      stock: product.stock,
    });
    openCart();
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle({
      productId: product.id,
      name: product.name,
      image: primaryImage,
      price: product.price,
      discountPrice: product.discountPrice,
      slug: product.slug,
    });
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div
        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300 relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* ── Image Container ── */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50">
          <motion.div
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full h-full"
          >
            <Image
              src={product.images[imgIdx] ?? primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-opacity duration-300"
              priority={false}
            />
          </motion.div>

          {/* Out of Stock overlay */}
          {outOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <span className="text-white font-bold text-sm uppercase tracking-widest bg-black/70 px-4 py-2 rounded-full">
                Out of Stock
              </span>
            </div>
          )}

          {/* Add to Cart overlay (visible on hover) */}
          <AnimatePresence>
            {hovered && !outOfStock && (
              <motion.button
                key="add-to-cart"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.2 }}
                onClick={handleAddToCart}
                aria-label="Add to cart"
                className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2
                           bg-[#C41E3A] hover:bg-[#a31830] text-white text-xs font-semibold
                           px-4 py-2 rounded-full shadow-lg whitespace-nowrap transition-colors"
              >
                <FiShoppingCart size={14} />
                Add to Cart
              </motion.button>
            )}
          </AnimatePresence>

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-white/90 backdrop-blur-sm
                       shadow hover:shadow-md transition-all"
          >
            <FiHeart
              size={16}
              className={
                wishlisted
                  ? 'fill-[#C41E3A] text-[#C41E3A]'
                  : 'text-gray-500 hover:text-[#C41E3A]'
              }
            />
          </button>

          {/* Badges – top-left */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
            {discountPct > 0 && (
              <Badge label={`-${discountPct}%`} className="bg-[#C41E3A]" />
            )}
            {product.isNewArrival && (
              <Badge label="New" className="bg-emerald-500" />
            )}
            {product.isFeatured && (
              <Badge label="Featured" className="bg-[#D4A017]" />
            )}
          </div>
        </div>

        {/* ── Product Info ── */}
        <div className="p-3">
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug mb-1 group-hover:text-[#C41E3A] transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating !== undefined && product.reviewCount !== undefined && (
            <div className="mb-1.5">
              <StarRating rating={product.rating} count={product.reviewCount} />
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-base font-bold text-[#C41E3A]">
              {formatCurrency(product.discountPrice ?? product.price)}
            </span>
            {product.discountPrice && product.discountPrice < product.price && (
              <span className="text-xs text-gray-400 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
