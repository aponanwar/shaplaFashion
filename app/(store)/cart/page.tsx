'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FiTrash2,
  FiArrowRight,
  FiShoppingBag,
  FiShield,
  FiTruck,
} from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency, SHIPPING_FEE } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal } = useCartStore();
  const [deliveryArea, setDeliveryArea] = useState<'dhaka' | 'outside'>('dhaka');
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  const cartSubtotal = subtotal();
  const shippingFee = cartSubtotal >= 999 && deliveryArea === 'dhaka' ? 0 : SHIPPING_FEE[deliveryArea];
  const orderTotal = Math.max(0, cartSubtotal + shippingFee - discount);

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupon.trim()) return;

    if (coupon.toUpperCase() === 'SHAPLA10') {
      const disc = Math.round(cartSubtotal * 0.1);
      setDiscount(disc);
      toast.success(`Coupon applied! 10% discount (-৳${disc})`);
    } else {
      toast.error('Invalid coupon code. Try SHAPLA10');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-5 text-3xl">
            <FiShoppingBag />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Your Cart is Empty</h2>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            Looks like you haven&apos;t added any items yet. Explore our handcrafted sarees, panjabis, and artisan crafts.
          </p>
          <Link
            href="/products"
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-md transition-all"
          >
            <span>Start Shopping</span>
            <FiArrowRight />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Shopping Cart</h1>
            <p className="text-sm text-gray-500 mt-1">
              You have {items.reduce((s, i) => s + i.quantity, 0)} item(s) in your bag
            </p>
          </div>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to clear your cart?')) {
                clearCart();
              }
            }}
            className="text-xs font-semibold text-gray-400 hover:text-red-600 transition-colors flex items-center gap-1"
          >
            <FiTrash2 /> Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Items Table / List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => {
              const currentPrice = item.discountPrice || item.price;
              const itemTotal = currentPrice * item.quantity;

              return (
                <div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-4 transition-all"
                >
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug truncate">
                      {item.name}
                    </h3>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-gray-500 mt-1.5">
                      {item.size && (
                        <span className="bg-gray-100 px-2 py-0.5 rounded">
                          Size: <strong>{item.size}</strong>
                        </span>
                      )}
                      {item.color && (
                        <span className="bg-gray-100 px-2 py-0.5 rounded">
                          Color: <strong>{item.color}</strong>
                        </span>
                      )}
                      <span className="text-gray-400 font-mono text-[11px]">
                        SKU: {item.sku}
                      </span>
                    </div>

                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                      <span className="font-extrabold text-primary-600 text-sm sm:text-base">
                        {formatCurrency(currentPrice)}
                      </span>
                      {item.discountPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatCurrency(item.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper & Subtotal */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1, item.size, item.color)
                        }
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-sm font-bold"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1, item.size, item.color)
                        }
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-sm font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-gray-900 text-sm sm:text-base">
                        {formatCurrency(itemTotal)}
                      </span>
                      <button
                        onClick={() => removeItem(item.productId, item.size, item.color)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                        title="Remove item"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="pt-2">
              <Link
                href="/products"
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                &larr; Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24 space-y-6">
              <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3">
                Order Summary
              </h3>

              {/* Delivery destination selector */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-2">
                  Delivery Destination:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setDeliveryArea('dhaka')}
                    className={`py-2 px-3 rounded-lg border text-center transition-all ${
                      deliveryArea === 'dhaka'
                        ? 'border-primary-600 bg-primary-50 text-primary-700 font-bold'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Dhaka Metro (৳60)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryArea('outside')}
                    className={`py-2 px-3 rounded-lg border text-center transition-all ${
                      deliveryArea === 'outside'
                        ? 'border-primary-600 bg-primary-50 text-primary-700 font-bold'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Outside Dhaka (৳120)
                  </button>
                </div>
                {cartSubtotal >= 999 && deliveryArea === 'dhaka' && (
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
                    <FiTruck /> Free Shipping applied for Dhaka!
                  </p>
                )}
              </div>

              {/* Coupon Form */}
              <form onSubmit={applyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code (e.g. SHAPLA10)"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors shrink-0"
                >
                  Apply
                </button>
              </form>

              {/* Price Calculations */}
              <div className="space-y-2.5 text-xs text-gray-600 pt-2 border-t border-gray-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-semibold text-gray-900">
                    {shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatCurrency(shippingFee)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total Amount</span>
                  <span className="text-primary-600">{formatCurrency(orderTotal)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                className="w-full py-4 px-6 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-lg shadow-primary-200 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <span>Proceed to Checkout</span>
                <FiArrowRight />
              </Link>

              {/* Badges */}
              <div className="pt-2 text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
                <FiShield className="text-emerald-500 text-sm" />
                <span>Cash on delivery & secure online payment supported</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
