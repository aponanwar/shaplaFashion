'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiPhone,
  FiArrowLeft,
  FiShield,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

interface OrderData {
  orderId: string;
  orderStatus: string;
  createdAt: string;
  total: number;
  subtotal: number;
  shippingFee: number;
  paymentMethod: string;
  paymentStatus: string;
  trackingNumber?: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    city: string;
    district: string;
  };
  items: {
    name: string;
    price: number;
    quantity: number;
    image: string;
    size?: string;
    color?: string;
    sku: string;
  }[];
}

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', desc: 'Received & awaiting review' },
  { key: 'confirmed', label: 'Confirmed', desc: 'Order approved by Shapla Fashion' },
  { key: 'processing', label: 'Packaging', desc: 'Handled & packed by artisans' },
  { key: 'shipped', label: 'In Transit', desc: 'Handed over to courier' },
  { key: 'delivered', label: 'Delivered', desc: 'Delivered to your doorstep' },
];

export default function OrderTrackingPage({ params }: { params: { orderId: string } }) {
  const { orderId } = params;
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order);
        } else {
          // Demo fallback
          setOrder({
            orderId,
            orderStatus: 'confirmed',
            createdAt: new Date().toISOString(),
            total: 2559,
            subtotal: 2499,
            shippingFee: 60,
            paymentMethod: 'cod',
            paymentStatus: 'unpaid',
            trackingNumber: 'STF-BD-' + Math.floor(100000 + Math.random() * 900000),
            shippingAddress: {
              fullName: 'Customer',
              phone: '017XXXXXXXX',
              addressLine1: 'Dhaka, Bangladesh',
              city: 'Dhaka',
              district: 'Dhaka',
            },
            items: [
              {
                name: 'Traditional Handloom Cotton Jamdani Saree',
                price: 2499,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80',
                size: 'Free Size',
                sku: 'JAM-COT-001',
              },
            ],
          });
        }
      } catch {
        // Fallback demo order
        setOrder({
          orderId,
          orderStatus: 'confirmed',
          createdAt: new Date().toISOString(),
          total: 2559,
          subtotal: 2499,
          shippingFee: 60,
          paymentMethod: 'cod',
          paymentStatus: 'unpaid',
          trackingNumber: 'STF-BD-892314',
          shippingAddress: {
            fullName: 'Customer',
            phone: '017XXXXXXXX',
            addressLine1: 'Dhaka, Bangladesh',
            city: 'Dhaka',
            district: 'Dhaka',
          },
          items: [
            {
              name: 'Traditional Handloom Cotton Jamdani Saree',
              price: 2499,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80',
              size: 'Free Size',
              sku: 'JAM-COT-001',
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-gray-500 font-semibold">Retrieving order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
        <p className="text-xs text-gray-500 mb-4">No order matches #{orderId}</p>
        <Link href="/" className="btn-primary text-xs py-2 px-4">Back to Home</Link>
      </div>
    );
  }

  const currentStepIdx = STATUS_STEPS.findIndex((s) => s.key === order.orderStatus);
  const activeIdx = currentStepIdx === -1 ? 1 : currentStepIdx;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/products"
            className="text-xs font-semibold text-gray-500 hover:text-primary-600 flex items-center gap-1"
          >
            <FiArrowLeft /> Back to Store
          </Link>
          <span className="text-xs text-gray-400 font-mono">Order: #{order.orderId}</span>
        </div>

        {/* Order Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <span className="text-xs text-gray-400 block uppercase tracking-wider">Tracking Reference</span>
              <h1 className="text-2xl font-black text-gray-900 font-mono mt-0.5">#{order.orderId}</h1>
              <p className="text-xs text-gray-500 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-BD', { dateStyle: 'long' })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-primary-50 text-primary-700 capitalize border border-primary-200">
                {order.orderStatus}
              </span>
              <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 text-gray-800 uppercase">
                {order.paymentMethod} &bull; {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Timeline tracker */}
          <div className="py-8">
            <div className="relative flex items-center justify-between">
              {/* Timeline bar background */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-0"></div>
              {/* Active filled line */}
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-600 transition-all duration-500 -z-0"
                style={{
                  width: `${(activeIdx / (STATUS_STEPS.length - 1)) * 100}%`,
                }}
              ></div>

              {STATUS_STEPS.map((step, idx) => {
                const isCompleted = idx <= activeIdx;
                const isCurrent = idx === activeIdx;

                return (
                  <div key={step.key} className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                        isCompleted
                          ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                          : 'bg-white text-gray-400 border-gray-300'
                      }`}
                    >
                      {isCompleted ? <FiCheckCircle /> : idx + 1}
                    </div>
                    <span
                      className={`text-[11px] font-bold mt-2 text-center max-w-[70px] ${
                        isCurrent ? 'text-primary-600 font-black' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {order.trackingNumber && (
            <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-600">Courier Tracking Code:</span>
              <span className="font-mono font-bold text-gray-900">{order.trackingNumber}</span>
            </div>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Shipping destination */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2">
              <FiMapPin className="text-primary-600" />
              <span>Shipping Address</span>
            </h3>
            <div className="space-y-1 text-xs text-gray-600">
              <p className="font-bold text-gray-900">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.district}
              </p>
            </div>
          </div>

          {/* Payment info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2">
              <FiShield className="text-emerald-600" />
              <span>Payment Details</span>
            </h3>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Method</span>
                <span className="font-bold uppercase text-gray-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status</span>
                <span className="font-bold text-emerald-600 uppercase">{order.paymentStatus}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount</span>
                <span className="font-extrabold text-primary-600 text-sm">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ordered Items Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="font-bold text-sm text-gray-900 mb-4 flex items-center gap-2">
            <FiPackage className="text-primary-600" />
            <span>Ordered Items ({order.items.length})</span>
          </h3>

          <div className="divide-y divide-gray-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-gray-900 truncate">{item.name}</h4>
                  <p className="text-[11px] text-gray-500">
                    Qty: {item.quantity} {item.size ? `• Size: ${item.size}` : ''}
                  </p>
                </div>
                <span className="font-bold text-xs text-gray-900">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp Help CTA */}
        <div className="p-4 bg-green-50 rounded-2xl border border-green-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-green-900">
          <div className="flex items-center gap-2.5">
            <FaWhatsapp className="text-2xl text-green-600 shrink-0" />
            <span>Need to update address or ask about delivery?</span>
          </div>
          <a
            href={`https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER || '+8801700000000').replace(/[^0-9]/g, '')}?text=Hi,%20I%20have%20a%20query%20about%20Order%20%23${order.orderId}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors shrink-0"
          >
            Chat with Support
          </a>
        </div>
      </div>
    </div>
  );
}
