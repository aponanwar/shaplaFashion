'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { FiChevronDown } from 'react-icons/fi';

interface SortDropdownProps {
  currentSort?: string;
}

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest Arrivals', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Customer Rating', value: 'rating' },
];

export default function SortDropdown({ currentSort = 'featured' }: SortDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', newSort);
    params.delete('page'); // Reset to page 1
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 font-medium hidden sm:inline">Sort by:</span>
        <div className="relative">
          <select
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="appearance-none bg-white border border-gray-200 text-gray-800 text-xs font-semibold rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer shadow-sm"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs" />
        </div>
      </div>
    </div>
  );
}
