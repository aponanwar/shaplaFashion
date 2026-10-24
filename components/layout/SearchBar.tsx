'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiX } from 'react-icons/fi';

const SEARCH_CATEGORIES = [
  { label: 'All Products', value: '' },
  { label: 'Clothes', value: 'clothes' },
  { label: 'Crafts', value: 'crafts' },
];

interface SearchSuggestion {
  label: string;
  category: string;
  categoryValue: string;
}

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Build quick suggestions from the query
  useEffect(() => {
    const q = query.trim();
    if (q.length < 1) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    const built = SEARCH_CATEGORIES.map((cat) => ({
      label: `Search for "${q}" in ${cat.label}`,
      category: cat.label,
      categoryValue: cat.value,
    }));
    setSuggestions(built);
    setShowDropdown(true);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        if (!query) setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [query]);

  const handleExpand = () => {
    setIsExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleSearch = useCallback(
    (q: string, category: string) => {
      if (!q.trim()) return;
      const params = new URLSearchParams({ q: q.trim() });
      if (category) params.set('category', category);
      router.push(`/search?${params.toString()}`);
      setShowDropdown(false);
      setQuery('');
      setIsExpanded(false);
    },
    [router]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch(query, '');
    if (e.key === 'Escape') {
      setShowDropdown(false);
      setQuery('');
      setIsExpanded(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative flex items-center">
      {/* Collapsed: icon button */}
      {!isExpanded && (
        <button
          onClick={handleExpand}
          aria-label="Open search"
          className="p-2 rounded-full text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
        >
          <FiSearch className="w-5 h-5" />
        </button>
      )}

      {/* Expanded search bar */}
      {isExpanded && (
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 w-64 md:w-80 lg:w-96 shadow-sm focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
          <FiSearch className="w-4 h-4 text-gray-400 shrink-0 mr-2" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search clothes, crafts…"
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
            aria-label="Search products"
            autoComplete="off"
          />
          {query ? (
            <button onClick={handleClear} aria-label="Clear search" className="ml-2 text-gray-400 hover:text-gray-600">
              <FiX className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => { setIsExpanded(false); setShowDropdown(false); }}
              aria-label="Close search"
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Dropdown suggestions */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden animate-slide-down">
          {suggestions.map((s) => (
            <button
              key={s.categoryValue}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSearch(query, s.categoryValue);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-primary-50 hover:text-primary-700 transition-colors group"
            >
              <FiSearch className="w-4 h-4 text-gray-400 group-hover:text-primary-500 shrink-0" />
              <span className="text-gray-700 group-hover:text-primary-700">{s.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
