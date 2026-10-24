'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  FiSearch,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiPhone,
  FiExternalLink,
  FiAlertCircle,
  FiShield,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

interface OrderData {
  orderId: string;
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    city: string;
    district: string;
  };
  items: {
    name: string;
    image: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
  }[];
  paymentMethod: string;
  paymentStatus: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  trackingNumber?: string;
  courier?: {
    provider: string;
    consignmentId?: string;
    trackingCode?: string;
    trackingUrl?: string;
    status?: string;
    shippedAt?: string;
  };
  statusHistory?: {
    status: string;
    note?: string;
    timestamp: string;
  }[];
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('id') || searchParams.get('phone') || '';

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) {
      toast.error('Please enter an Order ID or Phone number');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/orders/track?q=${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();

      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        setOrder(null);
        toast.error(data.error || 'No order found with this information');
      }
    } catch {
      setOrder(null);
      toast.error('Failed to look up order. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  // Stepper stages
  const STAGES = [
    { key: 'pending', label: 'Order Placed', bangla: 'অর্ডার গৃহীত' },
    { key: 'confirmed', label: 'Confirmed', bangla: 'যাচাইকৃত' },
    { key: 'processing', label: 'Packaging', bangla: 'প্যাকিং সম্পন্ন' },
    { key: 'shipped', label: 'In Transit', bangla: 'কুরিয়ারে হস্তান্তর' },
    { key: 'delivered', label: 'Delivered', bangla: 'ডেলিভারি সম্পন্ন' },
  ];

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'confirmed':
        return 1;
      case 'processing':
        return 2;
      case 'shipped':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 0;
    }
  };

  const currentStageIdx = order ? getStageIndex(order.orderStatus) : 0;

  return (
    <div className="bg-gray-50 min-h-screen py-10 md:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary-50 text-primary-600 mb-3 border border-primary-100">
            <FiTruck size={13} /> Live Parcel Tracking
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
            অর্ডার ট্র্যাক করুন
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            আপনার অর্ডার আইডি (যেমন <span className="font-mono font-bold text-gray-700">SF26109921</span>) অথবা ১১ ডিজিটের মোবাইল নম্বর দিন
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4 mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row items-center gap-3"
          >
            <div className="relative flex-1 w-full">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Enter Order ID (SF...) or Phone (017...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  খোঁজা হচ্ছে...
                </>
              ) : (
                <>
                  <FiTruck size={16} /> ট্র্যাক করুন
                </>
              )}
            </button>
          </form>
        </div>

        {/* Tracking Details */}
        {order && (
          <div className="space-y-6 animate-fade-in">
            {/* Status Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-8 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Order ID</span>
                    <span className="font-mono text-base font-extrabold text-gray-900">#{order.orderId}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wide border ${
                      order.orderStatus === 'delivered'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : order.orderStatus === 'shipped'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : order.orderStatus === 'confirmed'
                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        : 'bg-primary-50 text-primary-700 border-primary-200'
                    }`}
                  >
                    {order.orderStatus === 'delivered' ? '✓ ডেলিভারি সম্পন্ন' : `Status: ${order.orderStatus}`}
                  </span>
                </div>
              </div>

              {/* Visual Progress Stepper */}
              <div className="py-8">
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-4 left-6 right-6 h-1 bg-gray-200 -z-0">
                    <div
                      className="h-full bg-primary-600 transition-all duration-700"
                      style={{ width: `${(currentStageIdx / (STAGES.length - 1)) * 100}%` }}
                    />
                  </div>

                  {/* Step Icons */}
                  <div className="relative z-10 flex justify-between">
                    {STAGES.map((stg, idx) => {
                      const isCompleted = idx <= currentStageIdx;
                      const isCurrent = idx === currentStageIdx;

                      return (
                        <div key={stg.key} className="flex flex-col items-center text-center">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                              isCompleted
                                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30'
                                : 'bg-gray-100 text-gray-400 border border-gray-200'
                            } ${isCurrent ? 'ring-4 ring-primary-100 scale-110' : ''}`}
                          >
                            {isCompleted ? <FiCheckCircle size={15} /> : idx + 1}
                          </div>
                          <span
                            className={`text-xs font-bold mt-2.5 block ${
                              isCompleted ? 'text-gray-900' : 'text-gray-400'
                            }`}
                          >
                            {stg.label}
                          </span>
                          <span className="text-[10px] text-gray-500 hidden sm:block">
                            {stg.bangla}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Courier Partner Card (When Shipped) */}
              {order.courier && (
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
                      <FiTruck size={18} />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                        Official Delivery Partner
                      </span>
                      <h4 className="text-sm font-extrabold text-gray-900 capitalize">
                        {order.courier.provider} Courier Service
                      </h4>
                      <p className="text-xs text-gray-600 font-mono mt-0.5">
                        Consignment / Tracking: <span className="font-bold text-gray-900">{order.courier.trackingCode || order.trackingNumber}</span>
                      </p>
                    </div>
                  </div>

                  {order.courier.trackingUrl && (
                    <a
                      href={order.courier.trackingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-blue-200 text-blue-700 font-bold text-xs hover:bg-blue-600 hover:text-white transition-all shadow-xs"
                    >
                      কুরিয়ার ওয়েবসাইটে লাইভ ট্র্যাক <FiExternalLink size={12} />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Items & Delivery Address Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ordered Items */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                <h3 className="font-bold text-sm text-gray-900 mb-4 flex items-center gap-2">
                  <FiPackage className="text-primary-600" /> আইটেমস ({order.items.length})
                </h3>
                <div className="divide-y divide-gray-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center gap-3">
                      <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 truncate">{item.name}</h4>
                        <p className="text-[11px] text-gray-500">
                          Qty: {item.quantity} {item.size ? `• Size: ${item.size}` : ''}
                        </p>
                        <p className="text-xs font-bold text-primary-600 mt-0.5">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-3 mt-3 text-xs space-y-1">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Delivery Fee:</span>
                    <span>{formatCurrency(order.shippingFee)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-gray-900 pt-1 border-t">
                    <span>Total Amount:</span>
                    <span className="text-primary-600">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Details & Support */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-gray-900 mb-4 flex items-center gap-2">
                    <FiMapPin className="text-primary-600" /> ডেলিভারি তথ্য
                  </h3>
                  <div className="space-y-2 text-xs text-gray-600 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <p className="font-bold text-gray-900 text-sm">{order.shippingAddress.fullName}</p>
                    <p className="flex items-center gap-1.5 font-mono text-gray-700">
                      <FiPhone size={11} /> {order.shippingAddress.phone}
                    </p>
                    <p>{order.shippingAddress.addressLine1}</p>
                    <p className="font-semibold text-gray-800">
                      {order.shippingAddress.city}, {order.shippingAddress.district}
                    </p>
                    <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                      <span className="text-gray-500">Payment:</span>
                      <span className="font-bold uppercase text-gray-800">
                        {order.paymentMethod} ({order.paymentStatus})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct WhatsApp Assistance */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">অর্ডার সম্পর্কিত যেকোনো জিজ্ঞাসা থাকলে:</p>
                  <a
                    href={`https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER || '+8801700000000').replace(/[^0-9]/g, '')}?text=Hello%20Shapla%20Fashion,%20I%20have%20an%20inquiry%20regarding%20my%20Order%20%23${order.orderId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    <FaWhatsapp size={16} /> WhatsApp এ সরাসরি কথা বলুন
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {searched && !order && !loading && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-3">
              <FiAlertCircle size={24} />
            </div>
            <h3 className="font-bold text-gray-900 text-base">কোনো অর্ডার পাওয়া যায়নি</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              অনুগ্রহ করে সঠিক অর্ডার আইডি বা যে মোবাইল নম্বর দিয়ে অর্ডার করেছিলেন তা নিশ্চিত করুন।
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
