// app/(store)/products/page.tsx
// Server component — fetches products and renders listing with filters.

import { Suspense } from 'react';
import type { Metadata } from 'next';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters from '@/components/product/ProductFilters';
import ProductListSkeleton from '@/components/skeletons/ProductListSkeleton';
import SortDropdown from '@/components/product/SortDropdown';
import Pagination from '@/components/product/Pagination';
import MobileFilterButton from '@/components/product/MobileFilterButton';

export const metadata: Metadata = {
  title: 'Shop All Products',
  description:
    'Browse our collection of authentic Bangladeshi handloom sarees, panjabi, kurtis, and homemade crafts.',
};

interface ProductsPageProps {
  searchParams: {
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sizes?: string;
    sort?: string;
    page?: string;
  };
}

async function getProducts(searchParams: ProductsPageProps['searchParams']) {
  const params = new URLSearchParams();
  if (searchParams.category) params.set('category', searchParams.category);
  if (searchParams.minPrice) params.set('minPrice', searchParams.minPrice);
  if (searchParams.maxPrice) params.set('maxPrice', searchParams.maxPrice);
  if (searchParams.sizes) params.set('sizes', searchParams.sizes);
  if (searchParams.sort) params.set('sort', searchParams.sort);
  if (searchParams.page) params.set('page', searchParams.page);
  params.set('limit', '12');

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/products?${params.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) return { products: [], total: 0, pages: 1 };
  return res.json();
}

async function getCategories() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/categories`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.categories ?? [];
  } catch {
    return [];
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const [{ products, total, pages }, categories] = await Promise.all([
    getProducts(searchParams),
    getCategories(),
  ]);

  const currentPage = Number(searchParams.page ?? 1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">All Products</h1>
          <p className="text-sm text-gray-500 mt-1">
            {total > 0 ? `${total} product${total !== 1 ? 's' : ''} found` : 'No products found'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* ── Sidebar (desktop) ── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <ProductFilters
                categories={categories}
                searchParams={searchParams}
              />
            </div>
          </aside>

          {/* ── Main area ── */}
          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5 gap-3">
              {/* Mobile filter button */}
              <MobileFilterButton categories={categories} searchParams={searchParams} />

              {/* Sort dropdown */}
              <div className="ml-auto">
                <SortDropdown currentSort={searchParams.sort} />
              </div>
            </div>

            {/* Grid */}
            <Suspense fallback={<ProductListSkeleton />}>
              <ProductGrid products={products} />
            </Suspense>

            {/* Pagination */}
            {pages > 1 && (
              <div className="mt-10">
                <Pagination
                  currentPage={currentPage}
                  totalPages={pages}
                  searchParams={searchParams}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
