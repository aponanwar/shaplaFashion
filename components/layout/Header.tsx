'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiMenu,
  FiTruck,
  FiChevronDown,
} from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import SearchBar from './SearchBar';
import MobileMenu from './MobileMenu';
import CartDrawer from '@/components/cart/CartDrawer';

/* ─── Navigation data ─── */
const NAV_ITEMS = [
  {
    label: 'Categories',
    key: 'categories',
    megaMenu: [
      {
        groupLabel: 'Clothes',
        links: [
          { label: 'Sarees', href: '/category/sarees', emoji: '🥻' },
          { label: 'Panjabi', href: '/category/panjabi', emoji: '👘' },
          { label: 'Kurti', href: '/category/kurti', emoji: '👗' },
          { label: 'Salwar', href: '/category/salwar', emoji: '👚' },
          { label: 'Dress', href: '/category/dress', emoji: '👗' },
        ],
      },
      {
        groupLabel: 'Crafts',
        links: [
          { label: 'Jute Bags', href: '/category/jute-bags', emoji: '🧺' },
          { label: 'Pottery', href: '/category/pottery', emoji: '🏺' },
          { label: 'Kantha', href: '/category/kantha', emoji: '🪡' },
          { label: 'Bamboo', href: '/category/bamboo', emoji: '🎋' },
          { label: 'Wall Art', href: '/category/wall-art', emoji: '🖼️' },
        ],
      },
    ],
  },
  { label: 'Sale', key: 'sale', href: '/sale', badge: 'HOT', badgeColor: 'bg-primary-600' },
  { label: 'New Arrivals', key: 'new-arrivals', href: '/new-arrivals', badge: 'NEW', badgeColor: 'bg-gold-500' },
  { label: 'Track Order', key: 'track-order', href: '/track-order', badge: 'LIVE', badgeColor: 'bg-blue-600' },
  { label: 'About', key: 'about', href: '/about' },
];

/* ─── Shapla Flower Logo SVG ─── */
function ShaplaSVG({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <ellipse cx="20" cy="8" rx="5" ry="8" fill="#C41E3A" opacity="0.9" transform="rotate(0 20 20)" />
      <ellipse cx="20" cy="8" rx="5" ry="8" fill="#C41E3A" opacity="0.9" transform="rotate(60 20 20)" />
      <ellipse cx="20" cy="8" rx="5" ry="8" fill="#C41E3A" opacity="0.9" transform="rotate(120 20 20)" />
      <ellipse cx="20" cy="8" rx="5" ry="8" fill="#a01530" opacity="0.75" transform="rotate(180 20 20)" />
      <ellipse cx="20" cy="8" rx="5" ry="8" fill="#a01530" opacity="0.75" transform="rotate(240 20 20)" />
      <ellipse cx="20" cy="8" rx="5" ry="8" fill="#a01530" opacity="0.75" transform="rotate(300 20 20)" />
      <circle cx="20" cy="20" r="6" fill="#D4A017" />
      <circle cx="20" cy="20" r="3" fill="#fff" opacity="0.6" />
    </svg>
  );
}

/* ─── Announcement marquee ─── */
function AnnouncementBar() {
  const announcements = [
    'Free delivery within Dhaka on orders over ৳999',
    '🛍️ Authentic handloom sarees — crafted with love',
    '📦 Cash on Delivery available · bKash · Nagad accepted',
    '🎁 New arrivals every week — check out the latest drops!',
  ];
  const text = announcements.join('   ✦   ');

  return (
    <div className="bg-primary-600 text-white text-xs py-2 overflow-hidden relative">
      <div className="flex items-center gap-2 px-4">
        <FiTruck className="w-3.5 h-3.5 shrink-0 opacity-80" />
        <div className="overflow-hidden flex-1">
          <p className="whitespace-nowrap animate-[marquee_30s_linear_infinite]">{text}&nbsp;&nbsp;&nbsp;✦&nbsp;&nbsp;&nbsp;{text}</p>
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

/* ─── Icon badge button ─── */
function IconBadge({
  icon,
  label,
  count,
  onClick,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  count?: number;
  onClick?: () => void;
  href?: string;
}) {
  const inner = (
    <span className="relative inline-flex items-center justify-center p-2 rounded-full text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors">
      {icon}
      {count !== undefined && count > 0 && (
        <span
          suppressHydrationWarning
          className="absolute -top-0.5 -right-0.5 bg-primary-600 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5 leading-none"
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} aria-label={label} className="flex flex-col items-center gap-0.5 group">
        {inner}
        <span className="hidden xl:block text-[10px] text-gray-500 group-hover:text-primary-600 transition-colors leading-none">
          {label}
        </span>
      </Link>
    );
  }

  return (
    <button onClick={onClick} aria-label={label} className="flex flex-col items-center gap-0.5 group">
      {inner}
      <span className="hidden xl:block text-[10px] text-gray-500 group-hover:text-primary-600 transition-colors leading-none">
        {label}
      </span>
    </button>
  );
}

/* ─── Mega Menu Panel ─── */
function MegaMenuPanel({
  groups,
  isOpen,
}: {
  groups: { groupLabel: string; links: { label: string; href: string; emoji?: string }[] }[];
  isOpen: boolean;
}) {
  return (
    <div
      className={`absolute top-full left-0 w-[540px] max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50 transition-all duration-200 ${
        isOpen
          ? 'opacity-100 translate-y-1 pointer-events-auto'
          : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
    >
      <div className="grid grid-cols-2 gap-8">
        {groups.map((group) => (
          <div key={group.groupLabel}>
            <h3 className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-3 pb-2 border-b border-primary-100">
              {group.groupLabel}
            </h3>
            <ul className="space-y-1">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-700 hover:bg-primary-50 px-2 py-1.5 rounded-lg transition-colors"
                  >
                    {link.emoji && <span>{link.emoji}</span>}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {/* Bottom promo strip */}
      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between bg-primary-50 rounded-xl px-4 py-3">
        <div>
          <p className="text-xs font-bold text-primary-700">Explore All Collections →</p>
          <p className="text-[11px] text-gray-500">Handpicked authentic Bangladeshi pieces</p>
        </div>
        <Link
          href="/categories"
          className="text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          Shop All
        </Link>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN HEADER
═══════════════════════════════════════════ */
export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const megaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cartCount = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { toggleCart } = useCartStore();

  /* Scroll listener */
  useEffect(() => {
    setMounted(true);
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Mega menu hover handlers */
  const handleMegaEnter = useCallback((key: string) => {
    if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
    setActiveMega(key);
  }, []);

  const handleMegaLeave = useCallback(() => {
    megaTimerRef.current = setTimeout(() => setActiveMega(null), 120);
  }, []);

  const handleToggleAccordion = useCallback((key: string) => {
    setOpenAccordion((prev) => (prev === key ? null : key));
  }, []);

  return (
    <>
      {/* ─── Announcement Bar ─── */}
      <AnnouncementBar />

      {/* ─── Sticky Header Shell ─── */}
      <header
        className={`sticky top-0 z-30 bg-white transition-shadow duration-200 ${
          isScrolled ? 'shadow-md' : 'shadow-sm'
        }`}
      >
        {/* ── Main header row ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* LEFT: Hamburger (mobile) + Logo */}
            <div className="flex items-center gap-3">
              {/* Hamburger — mobile only */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation menu"
                className="lg:hidden p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <FiMenu className="w-5 h-5" />
              </button>

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 group shrink-0" aria-label="Shapla Fashion — Home">
                <ShaplaSVG size={34} />
                <div className="leading-none">
                  <span className="font-bold text-lg text-gray-900 group-hover:text-primary-700 transition-colors tracking-tight">
                    Shapla
                  </span>
                  <span className="font-light text-lg text-primary-600 tracking-tight"> Fashion</span>
                </div>
              </Link>
            </div>

            {/* CENTER: Search bar — hidden on xs/sm, visible md+ */}
            <div className="hidden md:flex flex-1 max-w-lg justify-center">
              <SearchBar />
            </div>

            {/* RIGHT: Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search — visible on mobile only */}
              <div className="md:hidden">
                <SearchBar />
              </div>

              <IconBadge
                icon={<FiHeart className="w-5 h-5" />}
                label="Wishlist"
                count={mounted ? wishlistCount : 0}
                href="/wishlist"
              />

              <IconBadge
                icon={<FiShoppingCart className="w-5 h-5" />}
                label="Cart"
                count={mounted ? cartCount : 0}
                onClick={toggleCart}
              />

              <IconBadge
                icon={<FiUser className="w-5 h-5" />}
                label="Account"
                href="/account"
              />
            </div>
          </div>
        </div>

        {/* ── Navigation row — desktop only ── */}
        <nav
          aria-label="Main navigation"
          className="hidden lg:block border-t border-gray-100"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex items-center h-11 gap-1">
              {NAV_ITEMS.map((item) => {
                const hasMega = !!item.megaMenu;
                const isActive = activeMega === item.key;

                return (
                  <li
                    key={item.key}
                    className="relative"
                    onMouseEnter={() => hasMega && handleMegaEnter(item.key)}
                    onMouseLeave={() => hasMega && handleMegaLeave()}
                  >
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary-700 hover:bg-primary-50 transition-colors"
                      >
                        {item.label}
                        {item.badge && (
                          <span className={`text-[9px] font-bold text-white px-1.5 py-0.5 rounded ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ) : (
                      <button
                        className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? 'text-primary-700 bg-primary-50'
                            : 'text-gray-700 hover:text-primary-700 hover:bg-primary-50'
                        }`}
                        aria-expanded={isActive}
                        aria-haspopup="true"
                      >
                        {item.label}
                        <FiChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${isActive ? 'rotate-180 text-primary-600' : 'text-gray-400'}`}
                        />
                      </button>
                    )}

                    {/* Mega menu */}
                    {hasMega && item.megaMenu && (
                      <MegaMenuPanel groups={item.megaMenu} isOpen={isActive} />
                    )}
                  </li>
                );
              })}

              {/* Divider + extra utility links */}
              <li className="ml-auto flex items-center gap-3">
                <Link href="/track-order" className="text-xs text-gray-500 hover:text-primary-600 transition-colors flex items-center gap-1">
                  📦 Track Order
                </Link>
                <Link href="/contact" className="text-xs text-gray-500 hover:text-primary-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* ─── Mobile Menu Drawer ─── */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        openAccordion={openAccordion}
        onToggleAccordion={handleToggleAccordion}
      />

      {/* ─── Cart Drawer ─── */}
      <CartDrawer />
    </>
  );
}
