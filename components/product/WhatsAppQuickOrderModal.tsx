'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiX, FiCheck, FiShoppingBag, FiTruck, FiMapPin, FiPhone, FiUser } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { formatCurrency, SHIPPING_FEE } from '@/lib/utils';
import toast from 'react-hot-toast';

interface WhatsAppQuickOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    discountPrice?: number;
    images: string[];
    sku?: string;
  };
  selectedSize?: string;
  selectedColor?: string;
  quantity?: number;
}

export default function WhatsAppQuickOrderModal({
  isOpen,
  onClose,
  product,
  selectedSize,
  selectedColor,
  quantity = 1,
}: WhatsAppQuickOrderModalProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState<'Dhaka' | 'Outside'>('Dhaka');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);

  if (!isOpen) return null;

  const itemPrice = product.discountPrice || product.price;
  const subtotal = itemPrice * quantity;
  const shippingFee = district === 'Dhaka' ? SHIPPING_FEE.dhaka : SHIPPING_FEE.outside;
  const total = subtotal + shippingFee;

  const handleQuickOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      toast.error('অনুগ্রহ করে নাম, মোবাইল নম্বর এবং সম্পূর্ণ ঠিকানা দিন');
      return;
    }

    const cleanPhone = phone.trim();
    if (!/^(\+880|880|0)1[3-9]\d{8}$/.test(cleanPhone)) {
      toast.error('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)');
      return;
    }

    setLoading(true);

    try {
      // 1. Create order in MongoDB backend to keep inventory & admin dashboard in sync
      const payload = {
        items: [
          {
            productId: product.id,
            name: product.name,
            image: product.images[0],
            price: itemPrice,
            quantity,
            size: selectedSize,
            color: selectedColor,
            sku: product.sku || `${product.id}-default`,
          },
        ],
        shippingAddress: {
          fullName,
          phone: cleanPhone,
          addressLine1: address,
          city: district === 'Dhaka' ? 'Dhaka' : 'Outside Dhaka',
          district: district === 'Dhaka' ? 'Dhaka' : 'Outside Dhaka',
        },
        paymentMethod: 'cod',
        orderSource: 'whatsapp',
        subtotal,
        shippingFee,
        total,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const orderId = data.order?.orderId || `SF${Date.now().toString().slice(-6)}`;

      setOrderSuccessId(orderId);

      // 2. Open WhatsApp with pre-filled message
      const businessPhone = (
        process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER || '+8801700000000'
      ).replace(/[^0-9]/g, '');

      const msg = `🌸 *নতুন ১-ক্লিক অর্ডার — Shapla Fashion*
──────────────────────
*অর্ডার আইডি:* #${orderId}
*প্রোডাক্ট:* ${product.name}
*সাইজ:* ${selectedSize || 'Standard'}
*কালার:* ${selectedColor || 'Standard'}
*পরিমাণ:* ${quantity} টি
*সাবটোটাল:* ৳${subtotal.toLocaleString()}
*ডেলিভারি ফি:* ৳${shippingFee} (${district === 'Dhaka' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে'})
*সর্বমোট প্রদেয় (COD):* ৳${total.toLocaleString()}

*ডেলিভারি তথ্য:*
👤 *নাম:* ${fullName}
📱 *মোবাইল:* ${cleanPhone}
📍 *ঠিকানা:* ${address}

অর্ডারটি কনফার্ম করুন ও ডেলিভারির সময় জানিয়ে দিন!`;

      window.open(`https://wa.me/${businessPhone}?text=${encodeURIComponent(msg)}`, '_blank');
      toast.success('অর্ডার তৈরি হয়েছে এবং WhatsApp ওপেন করা হয়েছে!');
    } catch {
      toast.error('অর্ডার প্রক্রিয়াকরণে ত্রুটি হয়েছে, আবার চেষ্টা করুন');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-100 animate-scale-up relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <FiX size={20} />
        </button>

        {orderSuccessId ? (
          /* Success Screen */
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <FiCheck size={32} />
            </div>
            <h3 className="text-xl font-black text-gray-900">অর্ডার সফলভাবে গ্রহণ করা হয়েছে!</h3>
            <p className="text-xs text-gray-500 mt-1">
              আপনার অর্ডার আইডি: <span className="font-mono font-bold text-gray-800">#{orderSuccessId}</span>
            </p>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs text-gray-600 my-5 text-left space-y-1.5">
              <p>আমরা আপনার WhatsApp-এ মেসেজ পাঠিয়েছি এবং আমাদের প্রতিনিধি দ্রুত আপনার সাথে যোগাযোগ করবেন।</p>
              <p>ডেলিভারির সময় ক্যাশ অন ডেলিভারিতে মোট <strong className="text-primary-600">৳{total.toLocaleString()}</strong> পরিশোধ করতে হবে।</p>
            </div>

            <div className="flex gap-3">
              <a
                href={`/track-order?id=${orderSuccessId}`}
                className="flex-1 py-3 rounded-xl bg-gray-900 text-white font-bold text-xs text-center hover:bg-black transition-colors"
              >
                অর্ডার ট্র্যাক করুন
              </a>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        ) : (
          /* Order Form */
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                <FaWhatsapp size={20} />
              </div>
              <div>
                <h3 className="font-black text-base sm:text-lg text-gray-900 leading-tight">
                  ১-ক্লিক দ্রুত অর্ডার (WhatsApp)
                </h3>
                <p className="text-[11px] text-gray-500">
                  কোনো অ্যাকাউন্ট খোলার ঝামেলা নেই, সরাসরি অর্ডার করুন
                </p>
              </div>
            </div>

            {/* Selected Product Pill */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-200 mb-5">
              <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0 text-xs">
                <h4 className="font-bold text-gray-900 truncate">{product.name}</h4>
                <p className="text-[11px] text-gray-500">
                  {selectedSize ? `Size: ${selectedSize}` : ''} {selectedColor ? `• Color: ${selectedColor}` : ''} • Qty: {quantity}
                </p>
                <p className="font-extrabold text-primary-600 text-sm mt-0.5">
                  {formatCurrency(subtotal)}
                </p>
              </div>
            </div>

            {/* Quick Form */}
            <form onSubmit={handleQuickOrder} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">আপনার নাম *</label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="যেমন: তানভীর আহমেদ"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">মোবাইল নম্বর *</label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-gray-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">ডেলিভারি এরিয়া</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDistrict('Dhaka')}
                    className={`py-2 px-3 rounded-xl font-bold border text-center transition-all ${
                      district === 'Dhaka'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    ঢাকার ভেতরে (৳৬০)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDistrict('Outside')}
                    className={`py-2 px-3 rounded-xl font-bold border text-center transition-all ${
                      district === 'Outside'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    ঢাকার বাইরে (৳১২০)
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">পূর্ণ ঠিকানা *</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3.5 top-3 text-gray-400" />
                  <textarea
                    required
                    rows={2}
                    placeholder="বাড়ি নং, রোড নং, এলাকা, থানা ও জেলা"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-gray-900"
                  />
                </div>
              </div>

              {/* Price Calculation Pill */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1">
                <div className="flex justify-between text-gray-500">
                  <span>প্রোডাক্ট মূল্য:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>ডেলিভারি চার্জ:</span>
                  <span>{formatCurrency(shippingFee)}</span>
                </div>
                <div className="flex justify-between font-extrabold text-sm text-gray-900 pt-1 border-t border-gray-200">
                  <span>মোট প্রদেয় (ক্যাশ অন ডেলিভারি):</span>
                  <span className="text-primary-600">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    অর্ডার প্রক্রিয়াধীন...
                  </>
                ) : (
                  <>
                    <FaWhatsapp size={18} /> অর্ডার কনফার্ম করুন (৳{total.toLocaleString()})
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
