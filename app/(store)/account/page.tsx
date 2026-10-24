'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
  FiUser,
  FiPackage,
  FiHeart,
  FiMapPin,
  FiLogOut,
  FiShoppingBag,
} from 'react-icons/fi';
import { useWishlistStore } from '@/store/wishlistStore';
import { formatCurrency } from '@/lib/utils';

export default function AccountPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist'>('orders');
  const { items: wishlistItems, removeItem } = useWishlistStore();

  const demoOrders = [
    {
      id: 'SF26107812',
      date: '2026-10-22',
      itemsCount: 2,
      total: 3450,
      status: 'shipped',
      paymentMethod: 'COD',
    },
    {
      id: 'SF26095621',
      date: '2026-09-14',
      itemsCount: 1,
      total: 1950,
      status: 'delivered',
      paymentMethod: 'bKash',
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Navigation Sidebar */}
          <div className="md:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-lg">
                  {session?.user?.name?.[0]?.toUpperCase() || <FiUser />}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-gray-900 truncate">
                    {session?.user?.name || 'Customer Account'}
                  </h3>
                  <p className="text-xs text-gray-400 truncate">
                    {session?.user?.email || 'Logged in shopper'}
                  </p>
                </div>
              </div>

              <nav className="space-y-1 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FiPackage />
                  <span>My Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                    activeTab === 'wishlist'
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FiHeart />
                  <span>Wishlist ({wishlistItems.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FiUser />
                  <span>Profile Info</span>
                </button>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FiLogOut />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 min-w-0">
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">My Orders</h2>
                <div className="divide-y divide-gray-100">
                  {demoOrders.map((ord) => (
                    <div key={ord.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-mono text-sm text-gray-900">#{ord.id}</span>
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize bg-emerald-50 text-emerald-700">
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Placed on {ord.date} &bull; {ord.itemsCount} item(s) &bull; {ord.paymentMethod}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-extrabold text-sm text-gray-900">
                          {formatCurrency(ord.total)}
                        </span>
                        <Link
                          href={`/orders/${ord.id}`}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Saved in Wishlist</h2>
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <FiHeart className="mx-auto text-4xl mb-2 opacity-30" />
                    <p className="text-xs">Your wishlist is empty.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistItems.map((item) => (
                      <div key={item.productId} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
                        <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden relative shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${item.slug}`} className="text-xs font-bold text-gray-900 truncate block hover:text-primary-600">
                            {item.name}
                          </Link>
                          <span className="text-xs font-extrabold text-primary-600 block mt-1">
                            {formatCurrency(item.discountPrice || item.price)}
                          </span>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-xs text-red-500 hover:underline shrink-0"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Profile Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-gray-600 block mb-1">Name</label>
                    <input
                      type="text"
                      defaultValue={session?.user?.name || 'Customer'}
                      className="w-full p-2.5 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-600 block mb-1">Email</label>
                    <input
                      type="email"
                      defaultValue={session?.user?.email || 'customer@example.com'}
                      className="w-full p-2.5 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button className="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-bold shadow-sm">
                      Update Profile
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
