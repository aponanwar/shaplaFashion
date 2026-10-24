'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  FiCheckCircle,
  FiTruck,
  FiCreditCard,
  FiShield,
  FiLock,
  FiShoppingBag,
  FiArrowLeft,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency, SHIPPING_FEE, BD_DISTRICTS } from '@/lib/utils';
import toast from 'react-hot-toast';

type PaymentMethodType = 'cod' | 'bkash' | 'nagad' | 'card';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    district: 'Dhaka',
    city: '',
    addressLine1: '',
    note: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('cod');
  const [bkashTrxId, setBkashTrxId] = useState('');
  const [nagadTrxId, setNagadTrxId] = useState('');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    nameOnCard: '',
  });

  const [loading, setLoading] = useState(false);

  const cartSubtotal = subtotal();
  const isDhaka = formData.district === 'Dhaka';
  const shippingFee = cartSubtotal >= 999 && isDhaka ? 0 : isDhaka ? SHIPPING_FEE.dhaka : SHIPPING_FEE.outside;
  const orderTotal = cartSubtotal + shippingFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.addressLine1.trim() || !formData.city.trim()) {
      toast.error('Please complete all required delivery details.');
      return;
    }

    // Phone validation
    const cleanPhone = formData.phone.trim();
    if (!/^(\+880|880|0)1[3-9]\d{8}$/.test(cleanPhone)) {
      toast.error('Please enter a valid 11-digit Bangladeshi mobile number (e.g. 017XXXXXXXX).');
      return;
    }

    if (paymentMethod === 'bkash' && !bkashTrxId.trim()) {
      toast.error('Please enter the bKash Transaction ID.');
      return;
    }

    if (paymentMethod === 'nagad' && !nagadTrxId.trim()) {
      toast.error('Please enter the Nagad Transaction ID.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          image: i.image,
          price: i.discountPrice || i.price,
          quantity: i.quantity,
          size: i.size,
          color: i.color,
          sku: i.sku,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          addressLine1: formData.addressLine1,
          city: formData.city,
          district: formData.district,
        },
        paymentMethod,
        paymentTransactionId:
          paymentMethod === 'bkash'
            ? bkashTrxId
            : paymentMethod === 'nagad'
            ? nagadTrxId
            : undefined,
        note: formData.note,
        guestEmail: formData.email,
        subtotal: cartSubtotal,
        shippingFee,
        total: orderTotal,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      clearCart();
      toast.success('Order placed successfully!');
      router.push(`/orders/${data.order.orderId}/success`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-16 px-4 bg-gray-50 text-center">
        <FiShoppingBag className="text-5xl text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-sm text-gray-500 mb-6">Add some products before proceeding to checkout.</p>
        <Link
          href="/products"
          className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-primary-700 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/cart"
            className="text-xs font-semibold text-gray-500 hover:text-primary-600 flex items-center gap-1 mb-2"
          >
            <FiArrowLeft /> Back to Cart
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Checkout</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Fill in your delivery address and choose a payment method.
          </p>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 7 Columns: Form Information */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Customer & Delivery Address */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <h2 className="font-bold text-lg text-gray-900">Delivery Information</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Nusrat Jahan"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Mobile Number (BD) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="01XXXXXXXXX"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none font-mono"
                    />
                    <span className="text-[11px] text-gray-400 mt-0.5 block">
                      Order status sent via SMS & WhatsApp
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      District *
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white cursor-pointer"
                    >
                      {BD_DISTRICTS.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Thana / Area / City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Dhanmondi, Mirpur, Uttara"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Detailed Street Address *
                    </label>
                    <textarea
                      name="addressLine1"
                      required
                      rows={2}
                      value={formData.addressLine1}
                      onChange={handleChange}
                      placeholder="House / Road / Flat number / Nearby Landmark"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Delivery Note (Optional)
                    </label>
                    <input
                      type="text"
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      placeholder="e.g. Call before delivery, gift wrap"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Method */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <h2 className="font-bold text-lg text-gray-900">Select Payment Method</h2>
                </div>

                {/* Method selector tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {/* COD */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      paymentMethod === 'cod'
                        ? 'border-primary-600 bg-primary-50 text-primary-700 ring-2 ring-primary-600 font-bold'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <FiTruck className="text-xl" />
                    <span className="text-xs">Cash on Deliv.</span>
                  </button>

                  {/* bKash */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bkash')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      paymentMethod === 'bkash'
                        ? 'border-pink-600 bg-pink-50 text-pink-700 ring-2 ring-pink-600 font-bold'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="text-lg font-black text-pink-600">bKash</span>
                    <span className="text-xs">Mobile Wallet</span>
                  </button>

                  {/* Nagad */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('nagad')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      paymentMethod === 'nagad'
                        ? 'border-orange-600 bg-orange-50 text-orange-700 ring-2 ring-orange-600 font-bold'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="text-lg font-black text-orange-600">Nagad</span>
                    <span className="text-xs">Mobile Wallet</span>
                  </button>

                  {/* Card */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      paymentMethod === 'card'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600 font-bold'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <FiCreditCard className="text-xl text-blue-600" />
                    <span className="text-xs">Credit/Debit</span>
                  </button>
                </div>

                {/* Method instructions */}
                {paymentMethod === 'cod' && (
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 leading-relaxed">
                    <p className="font-semibold text-gray-900 mb-1">💵 Cash On Delivery (Pay at Doorstep)</p>
                    Pay the total amount in cash to the courier representative upon delivery. Please keep exact change ready.
                  </div>
                )}

                {paymentMethod === 'bkash' && (
                  <div className="p-4 rounded-xl bg-pink-50 border border-pink-200 text-xs text-pink-900 space-y-3">
                    <p className="font-semibold text-sm">bKash Merchant Payment (Send ৳{orderTotal}):</p>
                    <ol className="list-decimal pl-4 space-y-1 text-xs">
                      <li>Go to your bKash app or dial *247#</li>
                      <li>Choose <strong>Payment</strong> option</li>
                      <li>Enter Merchant bKash Number: <strong>01700000000</strong></li>
                      <li>Enter Amount: <strong>৳{orderTotal}</strong></li>
                      <li>Enter Reference: <strong>SHAPLA</strong></li>
                      <li>Complete payment and copy the <strong>TrxID</strong> below</li>
                    </ol>
                    <div>
                      <label className="block text-xs font-bold mb-1">bKash Transaction ID (TrxID) *</label>
                      <input
                        type="text"
                        required
                        value={bkashTrxId}
                        onChange={(e) => setBkashTrxId(e.target.value)}
                        placeholder="e.g. 9J4K28LA0X"
                        className="w-full px-3 py-2 border border-pink-300 rounded-lg bg-white text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'nagad' && (
                  <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-900 space-y-3">
                    <p className="font-semibold text-sm">Nagad Merchant Payment (Send ৳{orderTotal}):</p>
                    <ol className="list-decimal pl-4 space-y-1 text-xs">
                      <li>Open Nagad App or dial *167#</li>
                      <li>Select <strong>Merchant Pay</strong></li>
                      <li>Enter Merchant Account: <strong>01700000000</strong></li>
                      <li>Enter Amount: <strong>৳{orderTotal}</strong></li>
                      <li>Enter Reference: <strong>SHAPLA</strong></li>
                      <li>Enter your PIN and copy the <strong>Transaction ID</strong> below</li>
                    </ol>
                    <div>
                      <label className="block text-xs font-bold mb-1">Nagad Transaction ID (TrxID) *</label>
                      <input
                        type="text"
                        required
                        value={nagadTrxId}
                        onChange={(e) => setNagadTrxId(e.target.value)}
                        placeholder="e.g. 7N3A99LK2Q"
                        className="w-full px-3 py-2 border border-orange-300 rounded-lg bg-white text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm">Visa / MasterCard / AMEX (Stripe Secure)</p>
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                        256-Bit SSL
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[11px] font-semibold mb-1">Name on Card</label>
                        <input
                          type="text"
                          value={cardData.nameOnCard}
                          onChange={(e) => setCardData({ ...cardData, nameOnCard: e.target.value })}
                          placeholder="e.g. NUSRAT JAHAN"
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold mb-1">Card Number</label>
                        <input
                          type="text"
                          value={cardData.cardNumber}
                          onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                          placeholder="4111 2222 3333 4444"
                          maxLength={19}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white text-xs font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold mb-1">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            value={cardData.expiry}
                            onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                            placeholder="12/28"
                            maxLength={5}
                            className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold mb-1">CVC / CVV</label>
                          <input
                            type="password"
                            value={cardData.cvc}
                            onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                            placeholder="123"
                            maxLength={4}
                            className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right 5 Columns: Order Summary Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24 space-y-6">
                <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3 flex items-center justify-between">
                  <span>Your Order ({items.length})</span>
                  <Link href="/cart" className="text-xs text-primary-600 font-semibold hover:underline">
                    Edit Cart
                  </Link>
                </h3>

                {/* Items preview */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 truncate">{item.name}</h4>
                        <p className="text-[11px] text-gray-500">
                          Qty: {item.quantity} {item.size ? `• ${item.size}` : ''}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-gray-900">
                        {formatCurrency((item.discountPrice || item.price) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Breakdown */}
                <div className="space-y-2 text-xs text-gray-600 pt-3 border-t border-gray-100">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping ({isDhaka ? 'Dhaka' : 'Outside Dhaka'})</span>
                    <span className="font-semibold text-gray-900">
                      {shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatCurrency(shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-gray-900 pt-3 border-t border-gray-200">
                    <span>Total Payable</span>
                    <span className="text-primary-600">{formatCurrency(orderTotal)}</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-xl bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-extrabold text-sm shadow-xl shadow-primary-200 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiLock />
                  <span>{loading ? 'Processing Order...' : `Confirm Order (৳${orderTotal.toLocaleString('en-BD')})`}</span>
                </button>

                <div className="space-y-2 text-[11px] text-gray-500 text-center pt-2">
                  <p className="flex items-center justify-center gap-1">
                    <FiShield className="text-emerald-500" />
                    <span>Safe & encrypted transactions guaranteed</span>
                  </p>
                  <p className="flex items-center justify-center gap-1 text-green-700">
                    <FaWhatsapp />
                    <span>Instant confirmation sent via SMS & WhatsApp</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
