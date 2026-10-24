'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiX, FiMinus, FiPlus, FiShoppingCart, FiTrash2, FiTruck, FiArrowRight } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';

const FREE_DELIVERY_THRESHOLD = 999;

export default function CartDrawer() {
  const [mounted, setMounted] = useState(false);
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalItems } = useCartStore();
  const sub = subtotal();
  const count = totalItems();
  const drawerRef = useRef<HTMLDivElement>(null);
  const shippingEstimate = sub >= FREE_DELIVERY_THRESHOLD ? 0 : 60;
  const remaining = FREE_DELIVERY_THRESHOLD - sub;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, closeCart]);

  const handleQtyChange = useCallback(
    (productId: string, qty: number, size?: string, color?: string) => {
      updateQuantity(productId, qty, size, color);
    },
    [updateQuantity]
  );

  const handleRemove = useCallback(
    (productId: string, size?: string, color?: string) => {
      removeItem(productId, size, color);
    },
    [removeItem]
  );

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed top-0 right-0 h-full w-full max-w-md z-50 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FiShoppingCart className="w-5 h-5 text-primary-600" />
            <h2 className="font-bold text-gray-900 text-lg">Your Cart</h2>
            {count > 0 && (
              <span className="bg-primary-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {count}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Free delivery progress bar */}
        {count > 0 && (
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <FiTruck className="w-4 h-4 text-primary-600 shrink-0" />
              {sub >= FREE_DELIVERY_THRESHOLD ? (
                <p className="text-xs text-green-600 font-medium">
                  🎉 You qualify for <strong>free delivery within Dhaka!</strong>
                </p>
              ) : (
                <p className="text-xs text-gray-600">
                  Add <strong className="text-primary-600">৳{remaining.toLocaleString('bn-BD')}</strong> more for free Dhaka delivery
                </p>
              )}
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-gold-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((sub / FREE_DELIVERY_THRESHOLD) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full px-8 text-center gap-5">
              {/* Shopping bag illustration */}
              <svg viewBox="0 0 120 120" className="w-32 h-32 opacity-20" fill="none">
                <path
                  d="M30 40h60l-8 55H38L30 40z"
                  stroke="#C41E3A"
                  strokeWidth="4"
                  strokeLinejoin="round"
                  fill="#fff0f0"
                />
                <path
                  d="M45 40c0-8.284 6.716-15 15-15s15 6.716 15 15"
                  stroke="#C41E3A"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="50" cy="65" r="3" fill="#C41E3A" opacity="0.5" />
                <circle cx="70" cy="65" r="3" fill="#C41E3A" opacity="0.5" />
                <path d="M50 78c2 4 8 6 10 6s8-2 10-6" stroke="#C41E3A" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Your cart is empty</h3>
                <p className="text-sm text-gray-500">Discover our beautiful collection of Bangladeshi clothes and crafts.</p>
              </div>
              <button
                onClick={closeCart}
                className="mt-2 inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-full transition-colors"
              >
                Continue Shopping <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50 px-5 py-3 space-y-1">
              {items.map((item) => {
                const effectivePrice = item.discountPrice ?? item.price;
                const key = `${item.productId}-${item.size ?? ''}-${item.color ?? ''}`;
                return (
                  <li key={key} className="flex gap-4 py-4">
                    {/* Image */}
                    <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                      <Image
                        src={item.image || '/placeholder-product.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate leading-snug">{item.name}</h4>
                      <div className="flex flex-wrap gap-x-2 mt-1">
                        {item.size && (
                          <span className="text-xs text-gray-500">Size: <strong>{item.size}</strong></span>
                        )}
                        {item.color && (
                          <span className="text-xs text-gray-500">Color: <strong>{item.color}</strong></span>
                        )}
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mt-1.5">
                        <span className="text-sm font-bold text-primary-600">৳{effectivePrice.toLocaleString()}</span>
                        {item.discountPrice && item.price > item.discountPrice && (
                          <span className="text-xs text-gray-400 line-through">৳{item.price.toLocaleString()}</span>
                        )}
                      </div>

                      {/* Qty controls + remove */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => handleQtyChange(item.productId, item.quantity - 1, item.size, item.color)}
                            aria-label="Decrease quantity"
                            className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <FiMinus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-sm font-semibold text-gray-800 min-w-[28px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQtyChange(item.productId, item.quantity + 1, item.size, item.color)}
                            aria-label="Increase quantity"
                            className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                            disabled={item.quantity >= (item.stock ?? 99)}
                          >
                            <FiPlus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemove(item.productId, item.size, item.color)}
                          aria-label={`Remove ${item.name}`}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer summary + CTAs */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 bg-white px-5 pt-4 pb-6 space-y-3">
            {/* Subtotal & shipping */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({count} {count === 1 ? 'item' : 'items'})</span>
                <span className="font-semibold text-gray-900">৳{sub.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="flex items-center gap-1">
                  <FiTruck className="w-3.5 h-3.5" /> Dhaka Shipping
                </span>
                {shippingEstimate === 0 ? (
                  <span className="font-semibold text-green-600">FREE</span>
                ) : (
                  <span className="font-semibold text-gray-900">৳{shippingEstimate}</span>
                )}
              </div>
              <div className="pt-2 border-t border-gray-100 flex justify-between text-base font-bold">
                <span>Estimated Total</span>
                <span className="text-primary-700">৳{(sub + shippingEstimate).toLocaleString()}</span>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-2 pt-1">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-bold py-3.5 rounded-xl text-center transition-colors flex items-center justify-center gap-2"
              >
                Checkout <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="w-full border border-gray-200 hover:border-primary-300 text-gray-700 hover:text-primary-700 font-semibold py-3 rounded-xl text-center transition-colors text-sm"
              >
                View Full Cart
              </Link>
            </div>

            <p className="text-center text-xs text-gray-400 pt-1">
              Secure checkout · COD · bKash · Nagad · Card
            </p>
          </div>
        )}
      </div>
    </>
  );
}
