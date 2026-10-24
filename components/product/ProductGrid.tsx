'use client';

// components/product/ProductGrid.tsx
// Renders a responsive grid of ProductCards.
// Shows ProductCardSkeleton placeholders while loading.

import ProductCard, { type ProductCardProduct } from './ProductCard';
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ProductGridProps {
  products: ProductCardProduct[];
  loading?: boolean;
  /** Number of columns on desktop (2 | 3 | 4). Defaults to 4. */
  columns?: 2 | 3 | 4;
}

// ─── Column class map ──────────────────────────────────────────────────────────

const colMap: Record<2 | 3 | 4, string> = {
  2: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
};

// ─── Component ─────────────────────────────────────────────────────────────────

export default function ProductGrid({
  products,
  loading = false,
  columns = 4,
}: ProductGridProps) {
  const gridCols = colMap[columns];

  if (loading) {
    return (
      <div className={`grid ${gridCols} gap-4 md:gap-6`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mb-4 opacity-30"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <p className="text-lg font-medium">No products found</p>
        <p className="text-sm mt-1">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols} gap-4 md:gap-6`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
