'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { FiX, FiShoppingCart, FiHeart, FiUser, FiChevronDown } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  openAccordion: string | null;
  onToggleAccordion: (key: string) => void;
}

const NAV_ITEMS = [
  {
    label: 'Categories',
    key: 'categories',
    children: [
      {
        groupLabel: 'Clothes',
        links: [
          { label: 'Sarees', href: '/category/sarees' },
          { label: 'Panjabi', href: '/category/panjabi' },
          { label: 'Kurti', href: '/category/kurti' },
          { label: 'Salwar', href: '/category/salwar' },
          { label: 'Dress', href: '/category/dress' },
        ],
      },
      {
        groupLabel: 'Crafts',
        links: [
          { label: 'Jute Bags', href: '/category/jute-bags' },
          { label: 'Pottery', href: '/category/pottery' },
          { label: 'Kantha', href: '/category/kantha' },
          { label: 'Bamboo', href: '/category/bamboo' },
          { label: 'Wall Art', href: '/category/wall-art' },
        ],
      },
    ],
  },
  { label: 'Sale', key: 'sale', href: '/sale' },
  { label: 'New Arrivals', key: 'new-arrivals', href: '/new-arrivals' },
  { label: 'About', key: 'about', href: '/about' },
];

export default function MobileMenu({ isOpen, onClose, openAccordion, onToggleAccordion }: MobileMenuProps) {
  const cartCount = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Focus trap: close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-sm z-50 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-primary-600">
          <div className="flex items-center gap-2">
            {/* Shapla Flower SVG */}
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none" className="shrink-0">
              <ellipse cx="20" cy="8" rx="5" ry="8" fill="white" opacity="0.9" transform="rotate(0 20 20)" />
              <ellipse cx="20" cy="8" rx="5" ry="8" fill="white" opacity="0.9" transform="rotate(60 20 20)" />
              <ellipse cx="20" cy="8" rx="5" ry="8" fill="white" opacity="0.9" transform="rotate(120 20 20)" />
              <ellipse cx="20" cy="8" rx="5" ry="8" fill="white" opacity="0.75" transform="rotate(180 20 20)" />
              <ellipse cx="20" cy="8" rx="5" ry="8" fill="white" opacity="0.75" transform="rotate(240 20 20)" />
              <ellipse cx="20" cy="8" rx="5" ry="8" fill="white" opacity="0.75" transform="rotate(300 20 20)" />
              <circle cx="20" cy="20" r="6" fill="#D4A017" />
            </svg>
            <span className="text-white font-bold text-lg tracking-wide">Shapla Fashion</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 rounded-full text-white hover:bg-white/20 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Quick links row */}
        <div className="flex items-center gap-0 border-b border-gray-100 bg-gray-50">
          <Link href="/account" onClick={onClose} className="flex-1 flex flex-col items-center gap-1 py-3 text-xs text-gray-600 hover:text-primary-600 transition-colors">
            <FiUser className="w-5 h-5" />
            <span>Account</span>
          </Link>
          <Link href="/wishlist" onClick={onClose} className="flex-1 flex flex-col items-center gap-1 py-3 text-xs text-gray-600 hover:text-primary-600 transition-colors relative">
            <FiHeart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-2 right-[calc(50%-14px)] bg-primary-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistCount > 9 ? '9+' : wishlistCount}
              </span>
            )}
            <span>Wishlist</span>
          </Link>
          <Link href="/cart" onClick={onClose} className="flex-1 flex flex-col items-center gap-1 py-3 text-xs text-gray-600 hover:text-primary-600 transition-colors relative">
            <FiShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-2 right-[calc(50%-14px)] bg-primary-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
            <span>Cart</span>
          </Link>
        </div>

        {/* Nav accordion */}
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV_ITEMS.map((item) => {
            if (item.href) {
              // Simple link
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center px-5 py-4 text-gray-800 font-medium text-[15px] hover:bg-primary-50 hover:text-primary-700 border-b border-gray-50 transition-colors"
                >
                  {item.label}
                  {item.key === 'sale' && (
                    <span className="ml-2 text-[10px] font-bold bg-primary-600 text-white px-1.5 py-0.5 rounded">HOT</span>
                  )}
                  {item.key === 'new-arrivals' && (
                    <span className="ml-2 text-[10px] font-bold bg-gold-500 text-white px-1.5 py-0.5 rounded">NEW</span>
                  )}
                </Link>
              );
            }

            // Accordion
            const isAccOpen = openAccordion === item.key;
            return (
              <div key={item.key} className="border-b border-gray-50">
                <button
                  onClick={() => onToggleAccordion(item.key)}
                  className="flex items-center justify-between w-full px-5 py-4 text-gray-800 font-medium text-[15px] hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  aria-expanded={isAccOpen}
                >
                  <span>{item.label}</span>
                  <FiChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isAccOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isAccOpen && (
                  <div className="bg-gray-50 animate-slide-down">
                    {item.children?.map((group) => (
                      <div key={group.groupLabel} className="px-5 pb-3">
                        <p className="text-[11px] font-bold text-primary-600 uppercase tracking-widest pt-3 pb-2">
                          {group.groupLabel}
                        </p>
                        <div className="grid grid-cols-2 gap-1">
                          {group.links.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={onClose}
                              className="text-sm text-gray-600 hover:text-primary-600 py-1.5 px-2 rounded hover:bg-primary-50 transition-colors"
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer links */}
        <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 space-y-2">
          <Link href="/track-order" onClick={onClose} className="block text-sm text-gray-500 hover:text-primary-600 transition-colors">
            📦 Track My Order
          </Link>
          <Link href="/contact" onClick={onClose} className="block text-sm text-gray-500 hover:text-primary-600 transition-colors">
            📞 Contact Us
          </Link>
          <Link href="/faq" onClick={onClose} className="block text-sm text-gray-500 hover:text-primary-600 transition-colors">
            ❓ FAQ
          </Link>
        </div>
      </div>
    </>
  );
}
