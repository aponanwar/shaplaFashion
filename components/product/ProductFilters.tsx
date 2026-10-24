'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { FiStar, FiRotateCcw } from 'react-icons/fi';

interface CategoryItem {
  _id?: string;
  name: string;
  slug: string;
}

interface ProductFiltersProps {
  categories?: (string | CategoryItem)[];
  searchParams?: Record<string, string | undefined>;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const CATEGORY_LIST = [
  { name: 'Handloom Sarees', slug: 'sarees' },
  { name: 'Men’s Panjabi', slug: 'panjabi' },
  { name: 'Women’s Kurtis', slug: 'kurti' },
  { name: 'Salwar Kameez', slug: 'salwar-kameez' },
  { name: 'Dresses', slug: 'dresses' },
  { name: 'Jute Bags & Crafts', slug: 'jute-crafts' },
  { name: 'Clay Pottery', slug: 'pottery' },
  { name: 'Nakshi Kantha', slug: 'nakshi-kantha' },
  { name: 'Bamboo Crafts', slug: 'bamboo-crafts' },
  { name: 'Wall Art', slug: 'wall-art' },
];

export default function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const selectedCategory = searchParams.get('category') || '';
  const selectedSize = searchParams.get('sizes') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const updateParam = (key: string, val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set(key, val);
    } else {
      params.delete(key);
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push(pathname);
  };

  const hasFilters = selectedCategory || selectedSize || minPrice || maxPrice;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 text-sm">Filters</h3>
        {hasFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1"
          >
            <FiRotateCcw size={12} /> Reset
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
          Categories
        </h4>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1 text-xs">
          <button
            onClick={() => updateParam('category', '')}
            className={`block w-full text-left px-2.5 py-1.5 rounded-md transition-colors ${
              !selectedCategory
                ? 'bg-primary-50 text-primary-700 font-bold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Products
          </button>
          {CATEGORY_LIST.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => updateParam('category', cat.slug)}
              className={`block w-full text-left px-2.5 py-1.5 rounded-md transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-primary-50 text-primary-700 font-bold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
          Price Range (৳ BDT)
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <input
            type="number"
            placeholder="Min ৳"
            value={minPrice}
            onChange={(e) => updateParam('minPrice', e.target.value)}
            className="px-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
          />
          <input
            type="number"
            placeholder="Max ৳"
            value={maxPrice}
            onChange={(e) => updateParam('maxPrice', e.target.value)}
            className="px-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
          />
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          <button
            onClick={() => {
              updateParam('minPrice', '0');
              updateParam('maxPrice', '1000');
            }}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[11px]"
          >
            Under ৳1,000
          </button>
          <button
            onClick={() => {
              updateParam('minPrice', '1000');
              updateParam('maxPrice', '2500');
            }}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[11px]"
          >
            ৳1,000 - ৳2,500
          </button>
          <button
            onClick={() => {
              updateParam('minPrice', '2500');
              updateParam('maxPrice', '10000');
            }}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[11px]"
          >
            Over ৳2,500
          </button>
        </div>
      </div>

      {/* Sizes Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
          Sizes
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map((size) => {
            const isSelected = selectedSize === size;
            return (
              <button
                key={size}
                onClick={() => updateParam('sizes', isSelected ? '' : size)}
                className={`w-9 h-8 rounded text-xs font-medium border transition-colors ${
                  isSelected
                    ? 'bg-primary-600 text-white border-primary-600 shadow-xs'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Customer Rating */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
          Rating
        </h4>
        <div className="space-y-1.5 text-xs">
          {[4, 3, 2].map((stars) => (
            <button
              key={stars}
              onClick={() => updateParam('rating', stars.toString())}
              className="flex items-center gap-1.5 text-gray-700 hover:text-primary-600 py-1"
            >
              <div className="flex text-gold-500">
                {Array.from({ length: stars }).map((_, i) => (
                  <FiStar key={i} className="fill-gold-500" size={13} />
                ))}
              </div>
              <span>& above</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
