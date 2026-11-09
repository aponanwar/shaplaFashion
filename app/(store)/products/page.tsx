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
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';

export const metadata: Metadata = {
  title: 'Shop All Products',
  description:
    'Browse our collection of authentic Bangladeshi handloom sarees, panjabi, kurtis, and homemade crafts.',
};

export const revalidate = 60;

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

const FALLBACK_CATEGORIES = [
  { id: '1', name: 'Sarees', slug: 'sarees' },
  { id: '2', name: 'Panjabi', slug: 'panjabi' },
  { id: '3', name: 'Kurti', slug: 'kurti' },
  { id: '4', name: 'Salwar Kameez', slug: 'salwar-kameez' },
  { id: '5', name: 'Jute Crafts', slug: 'jute-crafts' },
  { id: '6', name: 'Wall Art', slug: 'wall-art' },
];

const FALLBACK_PRODUCTS = [
  {
    id: 'p-1',
    name: 'Traditional Handloom Cotton Jamdani Saree',
    slug: 'handloom-cotton-jamdani-saree',
    price: 3200,
    discountPrice: 2499,
    stock: 14,
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80'],
    rating: 4.9,
    reviewCount: 38,
    isFeatured: true,
    isOnSale: true,
    sizes: ['Free Size'],
    colors: ['Maroon & Gold'],
  },
  {
    id: 'p-2',
    name: 'Royal Muslin Embroidered Panjabi',
    slug: 'royal-muslin-panjabi',
    price: 2400,
    discountPrice: 1950,
    stock: 20,
    images: ['https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=800&q=80'],
    rating: 4.8,
    reviewCount: 29,
    isFeatured: true,
    isNewArrival: true,
    isOnSale: true,
    sizes: ['38', '40', '42', '44'],
    colors: ['White', 'Navy Blue'],
  },
  {
    id: 'p-3',
    name: 'Handcrafted Eco Jute Tote Bag',
    slug: 'handcrafted-jute-tote-bag',
    price: 850,
    discountPrice: 680,
    stock: 35,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
    rating: 4.7,
    reviewCount: 42,
    isFeatured: true,
    isOnSale: true,
  },
  {
    id: 'p-4',
    name: 'Artisan Clay Terracotta Tea Set',
    slug: 'clay-terracotta-tea-set',
    price: 1250,
    discountPrice: 999,
    stock: 18,
    images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80'],
    rating: 4.9,
    reviewCount: 16,
    isNewArrival: true,
    isOnSale: true,
  },
  {
    id: 'p-5',
    name: 'Floral Block Print Pure Cotton Kurti',
    slug: 'floral-block-print-cotton-kurti',
    price: 1450,
    discountPrice: 1150,
    stock: 25,
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80'],
    rating: 4.6,
    reviewCount: 51,
    isNewArrival: true,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Sage Green', 'Indigo Blue'],
  },
  {
    id: 'p-6',
    name: 'Handmade Bamboo Fruit & Bread Basket',
    slug: 'handmade-bamboo-fruit-basket',
    price: 650,
    discountPrice: 520,
    stock: 40,
    images: ['https://images.unsplash.com/photo-1590736969955-71cc94801759?w=800&q=80'],
    rating: 4.8,
    reviewCount: 23,
    isOnSale: true,
  },
  {
    id: 'p-7',
    name: 'Heritage Nakshi Kantha Wall Tapestry',
    slug: 'heritage-nakshi-kantha-wall-tapestry',
    price: 3800,
    discountPrice: 2999,
    stock: 8,
    images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80'],
    rating: 5.0,
    reviewCount: 19,
    isFeatured: true,
    isOnSale: true,
  },
  {
    id: 'p-8',
    name: 'Classic Muslin Dupatta with Resham Border',
    slug: 'classic-muslin-dupatta-resham',
    price: 1100,
    discountPrice: 899,
    stock: 22,
    images: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80'],
    rating: 4.7,
    reviewCount: 33,
    isOnSale: true,
  },
];

async function getProducts(searchParams: ProductsPageProps['searchParams']) {
  const page = Math.max(1, Number(searchParams.page ?? 1));
  const limit = 12;
  const skip = (page - 1) * limit;

  try {
    await connectDB();

    const filter: Record<string, any> = { isActive: true };

    if (searchParams.category) {
      // Find category by slug
      const cat = await Category.findOne({ slug: searchParams.category }).lean();
      if (cat) {
        filter.category = cat._id;
      }
    }

    if (searchParams.minPrice || searchParams.maxPrice) {
      filter.price = {};
      if (searchParams.minPrice) filter.price.$gte = Number(searchParams.minPrice);
      if (searchParams.maxPrice) filter.price.$lte = Number(searchParams.maxPrice);
    }

    if (searchParams.sizes) {
      filter.sizes = { $in: searchParams.sizes.split(',').map((s) => s.trim()) };
    }

    // Sort map
    let sortObj: Record<string, 1 | -1> = { createdAt: -1 };
    if (searchParams.sort === 'price-asc') sortObj = { price: 1 };
    else if (searchParams.sort === 'price-desc') sortObj = { price: -1 };
    else if (searchParams.sort === 'rating') sortObj = { rating: -1 };

    const [productsDocs, total] = await Promise.all([
      Product.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    if (productsDocs && productsDocs.length > 0) {
      const formatted = productsDocs.map((p: any) => ({
        id: String(p._id),
        name: p.name,
        slug: p.slug,
        images: (p.images || []).map((img: any) => (typeof img === 'string' ? img : img.url)),
        price: p.price,
        discountPrice: p.discountPrice,
        rating: p.rating || 4.8,
        reviewCount: p.reviewCount || 10,
        isFeatured: p.isFeatured,
        isNewArrival: p.isNewArrival,
        isOnSale: p.isOnSale,
        stock: p.stock ?? 10,
        sizes: p.sizes,
        colors: p.colors,
      }));

      return {
        products: formatted,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
      };
    }
  } catch (error) {
    console.warn('MongoDB getProducts failed, falling back to demo products:', error);
  }

  // Fallback to Demo catalog
  return {
    products: FALLBACK_PRODUCTS,
    total: FALLBACK_PRODUCTS.length,
    pages: 1,
  };
}

async function getCategories() {
  try {
    await connectDB();
    const cats = await Category.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    if (cats && cats.length > 0) {
      return cats.map((c: any) => ({
        id: String(c._id),
        name: c.name,
        slug: c.slug,
        count: 0,
      }));
    }
  } catch (error) {
    console.warn('MongoDB getCategories failed, falling back to demo categories:', error);
  }

  return FALLBACK_CATEGORIES;
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
              <ProductFilters categories={categories} searchParams={searchParams} />
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
