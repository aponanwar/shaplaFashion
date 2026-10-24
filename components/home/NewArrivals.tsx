'use client';

import Link from 'next/link';
import { FiArrowRight, FiStar } from 'react-icons/fi';
import ProductCard, { ProductCardProduct } from '@/components/product/ProductCard';

interface NewArrivalsProps {
  products?: ProductCardProduct[];
}

const DEMO_NEW_ARRIVALS: ProductCardProduct[] = [
  {
    id: 'na1',
    name: 'Hand-painted Folk Wall Hanging',
    slug: 'hand-painted-folk-wall-hanging',
    price: 1800,
    discountPrice: 1550,
    stock: 12,
    images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&q=80'],
    rating: 4.9,
    reviewCount: 14,
    isNewArrival: true,
  },
  {
    id: 'na2',
    name: 'Organic Cotton Block Print Kurti',
    slug: 'organic-cotton-block-print-kurti',
    price: 950,
    discountPrice: 799,
    stock: 25,
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&q=80'],
    rating: 4.7,
    reviewCount: 31,
    isNewArrival: true,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Maroon', 'Indigo'],
  },
  {
    id: 'na3',
    name: 'Fine Bamboo Fruit Basket (Set of 2)',
    slug: 'fine-bamboo-fruit-basket',
    price: 550,
    discountPrice: 450,
    stock: 18,
    images: ['https://images.unsplash.com/photo-1590736969955-71cc94801759?w=500&q=80'],
    rating: 4.8,
    reviewCount: 19,
    isNewArrival: true,
  },
  {
    id: 'na4',
    name: 'Royal Muslin Embroidered Panjabi',
    slug: 'royal-muslin-embroidered-panjabi',
    price: 2400,
    discountPrice: 1999,
    stock: 10,
    images: ['https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=500&q=80'],
    rating: 5.0,
    reviewCount: 22,
    isNewArrival: true,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Cream'],
  },
];

export default function NewArrivals({ products }: NewArrivalsProps) {
  const displayProducts = products && products.length > 0 ? products : DEMO_NEW_ARRIVALS;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
              <FiStar />
              <span>FRESH FROM ARTISANS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              New Arrivals Collection
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Newly launched handloom weaves and limited-edition crafts
            </p>
          </div>

          <Link
            href="/products?sort=newest"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 hover:text-primary-700 group transition-colors"
          >
            <span>Explore All New</span>
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
