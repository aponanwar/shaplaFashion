'use client';

import Link from 'next/link';
import { FiCheckCircle, FiPackage, FiTruck, FiArrowRight, FiHome } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function OrderSuccessPage({ params }: { params: { orderId: string } }) {
  const { orderId } = params;
  const waNumber = (process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER || '+8801700000000').replace(/[^0-9]/g, '');

  const waTrackUrl = `https://wa.me/${waNumber}?text=Hi%20Shapla%20Fashion,%20I%20just%20placed%20order%20%23${orderId}.%20Please%20confirm!`;

  return (
    <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center py-16 px-4">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10 text-center animate-slide-up">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
          <FiCheckCircle />
        </div>

        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">
          Order Confirmed!
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3 mb-2">
          Thank You For Your Order!
        </h1>

        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          We have received your order and our team is preparing it with care. A confirmation SMS & WhatsApp message has been dispatched to your mobile number.
        </p>

        {/* Order ID Box */}
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 mb-8 flex items-center justify-between">
          <div className="text-left">
            <span className="text-xs text-gray-400 block uppercase tracking-wider">Your Order ID</span>
            <span className="text-base font-extrabold text-gray-900 font-mono">#{orderId}</span>
          </div>
          <Link
            href={`/orders/${orderId}`}
            className="text-xs font-bold text-primary-600 hover:text-primary-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-xs"
          >
            Track Status &rarr;
          </Link>
        </div>

        {/* Quick actions */}
        <div className="space-y-3">
          <a
            href={waTrackUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 px-6 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <FaWhatsapp className="text-xl" />
            <span>Notify us on WhatsApp</span>
          </a>

          <Link
            href="/products"
            className="w-full py-3.5 px-6 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <FiHome />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Delivery estimation notice */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-center gap-2">
          <FiTruck className="text-primary-600 text-sm" />
          <span>Expected delivery: 24h within Dhaka, 2-4 days across Bangladesh</span>
        </div>
      </div>
    </div>
  );
}
