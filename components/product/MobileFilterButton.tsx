'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { FiFilter, FiX } from 'react-icons/fi';

interface MobileFilterButtonProps {
  categories?: { name: string; slug: string }[];
  searchParams?: Record<string, string | undefined>;
}

export default function MobileFilterButton({
  categories = [],
}: MobileFilterButtonProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentCategory = searchParams.get('category') || '';

  const handleSelectCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
      >
        <FiFilter />
        <span>Filters</span>
        {currentCategory && (
          <span className="w-2 h-2 rounded-full bg-primary-600"></span>
        )}
      </button>

      {/* Slide-over backdrop */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setOpen(false)}
          />

          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col z-10 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">Filters</h3>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="py-6 space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Categories
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => handleSelectCategory('')}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      !currentCategory
                        ? 'bg-primary-50 text-primary-700 font-bold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => handleSelectCategory(cat.slug)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        currentCategory === cat.slug
                          ? 'bg-primary-50 text-primary-700 font-bold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
