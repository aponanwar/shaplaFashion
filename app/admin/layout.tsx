'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome,
  FiShoppingBag,
  FiPackage,
  FiLayers,
  FiUsers,
  FiSettings,
  FiExternalLink,
  FiMenu,
  FiX,
  FiBell,
  FiAlertTriangle,
} from 'react-icons/fi';

const NAV_ITEMS = [
  { label: 'Overview', href: '/admin/dashboard', icon: FiHome },
  { label: 'Products', href: '/admin/products', icon: FiShoppingBag },
  { label: 'Orders', href: '/admin/orders', icon: FiPackage },
  { label: 'Inventory System', href: '/admin/inventory', icon: FiLayers, badge: 'Live' },
  { label: 'Customers', href: '/admin/customers', icon: FiUsers },
  { label: 'Settings', href: '/admin/settings', icon: FiSettings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-6 border-b border-gray-800 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="text-xl">🌸</span>
            <span className="font-extrabold text-base tracking-tight text-white font-sans">
              Shapla<span className="text-primary-500">Admin</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Store badge */}
        <div className="p-4 mx-4 my-3 rounded-xl bg-gray-800/60 border border-gray-700/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-semibold">Store Status</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live & Accepting Orders
            </span>
          </div>
          <Link
            href="/"
            target="_blank"
            className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors"
            title="Open Live Shop"
          >
            <FiExternalLink size={14} />
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-900/50'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-gold-500 text-gray-900">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer profile indicator */}
        <div className="p-4 border-t border-gray-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-primary-600 text-white font-bold flex items-center justify-center shrink-0">
              A
            </div>
            <div className="min-w-0">
              <span className="font-bold text-gray-200 block truncate">Administrator</span>
              <span className="text-[10px] text-gray-500 block truncate">admin@shaplaFashion.com</span>
            </div>
          </div>
          <Link href="/" className="text-gray-400 hover:text-white" title="Return to Shop">
            <FiExternalLink size={14} />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <FiMenu size={20} />
            </button>
            <h1 className="font-bold text-gray-900 text-sm sm:text-base capitalize">
              {pathname.replace('/admin/', '').replace('/', ' ') || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              <FiExternalLink /> View Customer Shop
            </Link>
          </div>
        </header>

        {/* Main page content */}
        <main className="p-4 sm:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
