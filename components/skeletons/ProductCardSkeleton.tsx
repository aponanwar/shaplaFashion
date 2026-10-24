'use client';

// components/skeletons/ProductCardSkeleton.tsx
// Skeleton placeholder that mirrors the ProductCard layout

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      {/* Image area */}
      <div className="relative aspect-[3/4] w-full bg-gray-200 skeleton" />

      {/* Body */}
      <div className="p-3 space-y-2">
        {/* Product name */}
        <div className="h-4 bg-gray-200 rounded skeleton w-3/4" />
        <div className="h-3 bg-gray-200 rounded skeleton w-1/2" />

        {/* Rating row */}
        <div className="flex items-center gap-2">
          <div className="h-3 bg-gray-200 rounded skeleton w-20" />
          <div className="h-3 bg-gray-200 rounded skeleton w-10" />
        </div>

        {/* Price row */}
        <div className="flex items-center gap-2 pt-1">
          <div className="h-5 bg-gray-200 rounded skeleton w-16" />
          <div className="h-4 bg-gray-200 rounded skeleton w-12" />
        </div>
      </div>
    </div>
  );
}
