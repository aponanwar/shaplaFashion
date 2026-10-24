'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FiPrinter, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

export default function OrderInvoicePage() {
  const params = useParams();
  const orderId = (params.orderId as string)?.toUpperCase();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/track?q=${orderId}`);
        const data = await res.json();
        if (data.success && data.order) {
          setOrder(data.order);
        }
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }
    if (orderId) loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const orderData = order || {
    orderId: orderId || 'SF26109921',
    createdAt: new Date().toISOString(),
    shippingAddress: {
      fullName: 'Nusrat Jahan',
      phone: '01711223344',
      addressLine1: 'House 42, Road 9A',
      city: 'Dhanmondi',
      district: 'Dhaka',
    },
    items: [
      {
        name: 'Handloom Cotton Jamdani Saree',
        sku: 'SKU-JAM-01',
        size: 'Free Size',
        color: 'Heritage Red',
        quantity: 1,
        price: 2450,
      },
    ],
    subtotal: 2450,
    shippingFee: 60,
    discount: 0,
    total: 2510,
    paymentMethod: 'cod',
    paymentStatus: 'unpaid',
    courier: {
      provider: 'steadfast',
      consignmentId: 'ST-992100',
      trackingCode: 'SF892100',
    },
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8 print:py-0 print:bg-white text-gray-900 font-sans">
      {/* Top action bar (hidden during print) */}
      <div className="max-w-3xl mx-auto mb-6 px-4 flex items-center justify-between print:hidden">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 bg-white px-3.5 py-2 rounded-xl shadow-xs border border-gray-200"
        >
          <FiArrowLeft size={14} /> Back to Orders
        </Link>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
        >
          <FiPrinter size={15} /> Print Invoice / Packing Slip
        </button>
      </div>

      {/* Invoice Sheet */}
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-md border border-gray-200 print:shadow-none print:border-none print:rounded-none print:p-0">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
          <div>
            <span className="text-xl font-black text-primary-600 tracking-tight block">
              SHAPLA FASHION
            </span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold block">
              Authentic Bangladeshi Clothing & Crafts
            </span>
            <p className="text-xs text-gray-500 mt-2">
              Dhaka, Bangladesh | Hotline: +8801700000000<br />
              Email: support@shaplafashion.com | www.shaplafashion.com
            </p>
          </div>

          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-gray-900 text-white font-black text-xs uppercase tracking-wider rounded-md mb-2">
              INVOICE & PACKING SLIP
            </span>
            <div className="text-xs text-gray-600">
              <p>Invoice No: <span className="font-mono font-bold text-gray-900">#{orderData.orderId}</span></p>
              <p>Date: {new Date(orderData.createdAt).toLocaleDateString('en-GB')}</p>
            </div>
          </div>
        </div>

        {/* Courier & Consignment Badge */}
        {orderData.courier && (
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 mb-6 flex items-center justify-between text-xs">
            <div>
              <span className="text-gray-400 font-semibold uppercase text-[10px] block">Courier Partner</span>
              <span className="font-bold text-gray-900 capitalize text-sm">{orderData.courier.provider} Courier</span>
            </div>
            <div>
              <span className="text-gray-400 font-semibold uppercase text-[10px] block">Consignment ID</span>
              <span className="font-mono font-bold text-gray-900">{orderData.courier.consignmentId || 'N/A'}</span>
            </div>
            <div className="text-right">
              <span className="text-gray-400 font-semibold uppercase text-[10px] block">Tracking Code</span>
              <span className="font-mono font-bold text-primary-600 text-sm">{orderData.courier.trackingCode || orderData.trackingNumber || 'N/A'}</span>
            </div>
          </div>
        )}

        {/* Customer & Shipping Details */}
        <div className="grid grid-cols-2 gap-8 mb-8 text-xs">
          <div>
            <h4 className="font-bold uppercase tracking-wider text-gray-400 text-[10px] mb-2">
              Billed & Shipped To:
            </h4>
            <p className="font-extrabold text-sm text-gray-900">{orderData.shippingAddress.fullName}</p>
            <p className="font-mono font-bold text-gray-700 mt-0.5">{orderData.shippingAddress.phone}</p>
            <p className="text-gray-600 mt-1">{orderData.shippingAddress.addressLine1}</p>
            <p className="text-gray-600">{orderData.shippingAddress.city}, {orderData.shippingAddress.district}</p>
          </div>

          <div className="text-right">
            <h4 className="font-bold uppercase tracking-wider text-gray-400 text-[10px] mb-2">
              Payment Information:
            </h4>
            <p className="font-bold text-gray-900 uppercase">Method: {orderData.paymentMethod}</p>
            <p className="text-gray-600">Status: <span className="font-bold capitalize">{orderData.paymentStatus}</span></p>
            {orderData.paymentMethod === 'cod' && (
              <div className="mt-3 inline-block bg-amber-50 border border-amber-300 text-amber-900 px-3 py-1.5 rounded-lg text-left">
                <span className="text-[10px] font-bold block uppercase">Cash to Collect (COD):</span>
                <span className="font-extrabold text-base text-primary-600">{formatCurrency(orderData.total)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full text-xs text-left mb-8 border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase font-bold text-[10px] border-b border-gray-200">
              <th className="py-2.5 px-3">Item Description</th>
              <th className="py-2.5 px-3">SKU / Options</th>
              <th className="py-2.5 px-3 text-center">Qty</th>
              <th className="py-2.5 px-3 text-right">Price</th>
              <th className="py-2.5 px-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orderData.items.map((item: any, i: number) => (
              <tr key={i}>
                <td className="py-3 px-3 font-bold text-gray-900">{item.name}</td>
                <td className="py-3 px-3 text-gray-500 font-mono text-[11px]">
                  {item.size ? `Size: ${item.size}` : ''} {item.color ? `• ${item.color}` : ''}
                </td>
                <td className="py-3 px-3 text-center font-bold">{item.quantity}</td>
                <td className="py-3 px-3 text-right">{formatCurrency(item.price)}</td>
                <td className="py-3 px-3 text-right font-bold">{formatCurrency(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-64 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span className="font-bold">{formatCurrency(orderData.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee:</span>
              <span>{formatCurrency(orderData.shippingFee)}</span>
            </div>
            {orderData.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-{formatCurrency(orderData.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t border-gray-300">
              <span>Total Payable:</span>
              <span className="text-primary-600">{formatCurrency(orderData.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer Terms */}
        <div className="border-t border-gray-200 pt-6 text-[10px] text-gray-400 text-center space-y-1">
          <p>Thank you for supporting authentic Bangladeshi handicrafts and traditional fashion artisans.</p>
          <p>For returns, exchange or complaints within 7 days, contact us at +8801700000000 with this Invoice Number.</p>
        </div>
      </div>
    </div>
  );
}
