'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FiPackage,
  FiSearch,
  FiFilter,
  FiCheck,
  FiTruck,
  FiMapPin,
  FiPhone,
  FiExternalLink,
  FiPrinter,
  FiSend,
  FiX,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/lib/utils';

interface OrderRow {
  id: string;
  customer: string;
  phone: string;
  city: string;
  district: string;
  items: string;
  total: number;
  paymentMethod: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  trackingNumber?: string;
  courierProvider?: string;
  isVerified?: boolean;
}

const DEMO_ORDERS: OrderRow[] = [
  {
    id: 'SF26109921',
    customer: 'Nusrat Jahan',
    phone: '01711223344',
    city: 'Dhanmondi',
    district: 'Dhaka',
    items: 'Handloom Cotton Jamdani Saree (1)',
    total: 2510,
    paymentMethod: 'COD',
    status: 'pending',
    date: 'Oct 24, 10:15 AM',
    isVerified: true,
  },
  {
    id: 'SF26108422',
    customer: 'Tanvir Ahmed',
    phone: '01899887766',
    city: 'Nasirabad',
    district: 'Chittagong',
    items: 'Royal Muslin Panjabi (2)',
    total: 3960,
    paymentMethod: 'bKash',
    status: 'confirmed',
    date: 'Oct 24, 09:30 AM',
    isVerified: true,
  },
  {
    id: 'SF26107310',
    customer: 'Farhana Kabir',
    phone: '01922334455',
    city: 'Uttara',
    district: 'Dhaka',
    items: 'Handcrafted Eco Jute Tote Bag (2), Pottery Vase (1)',
    total: 1898,
    paymentMethod: 'Nagad',
    status: 'shipped',
    date: 'Oct 23, 04:10 PM',
    trackingNumber: 'SF892100',
    courierProvider: 'steadfast',
    isVerified: true,
  },
  {
    id: 'SF26106200',
    customer: 'Rafiqul Islam',
    phone: '01655443322',
    city: 'Sylhet Sadar',
    district: 'Sylhet',
    items: 'Organic Block Print Kurti (1)',
    total: 859,
    paymentMethod: 'Card',
    status: 'delivered',
    date: 'Oct 22, 02:45 PM',
    trackingNumber: 'PTH-662011',
    courierProvider: 'pathao',
    isVerified: true,
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>(DEMO_ORDERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Courier booking modal state
  const [selectedOrderForCourier, setSelectedOrderForCourier] = useState<OrderRow | null>(null);
  const [courierProvider, setCourierProvider] = useState<'steadfast' | 'pathao'>('steadfast');
  const [courierNote, setCourierNote] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const handleStatusChange = (id: string, newStatus: any) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === id ? { ...ord, status: newStatus } : ord))
    );
    toast.success(`Order #${id} marked as ${newStatus}`);
  };

  const handleBookCourier = async () => {
    if (!selectedOrderForCourier) return;

    setBookingLoading(true);
    try {
      const res = await fetch('/api/admin/courier/ship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrderForCourier.id,
          provider: courierProvider,
          note: courierNote,
        }),
      });

      const data = await res.json();
      if (data.success && data.shipment) {
        setOrders((prev) =>
          prev.map((ord) =>
            ord.id === selectedOrderForCourier.id
              ? {
                  ...ord,
                  status: 'shipped',
                  trackingNumber: data.shipment.trackingCode,
                  courierProvider: data.shipment.provider,
                }
              : ord
          )
        );
        toast.success(
          `Booked with ${data.shipment.provider.toUpperCase()}! Tracking: ${data.shipment.trackingCode}`
        );
        setSelectedOrderForCourier(null);
      } else {
        toast.error(data.error || 'Failed to book courier parcel');
      }
    } catch {
      toast.error('Network error while booking parcel');
    } finally {
      setBookingLoading(false);
    }
  };

  const filtered = orders.filter((ord) => {
    const matchesSearch =
      ord.id.toLowerCase().includes(search.toLowerCase()) ||
      ord.customer.toLowerCase().includes(search.toLowerCase()) ||
      ord.phone.includes(search);

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && ord.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">Orders & Courier Logistics</h1>
          <p className="text-xs text-gray-500 mt-1">
            Track customer orders, 1-click book with Steadfast / Pathao Courier, and print invoices.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search order ID, phone, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-colors ${
              statusFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({orders.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-colors ${
              statusFilter === 'pending' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter('confirmed')}
            className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-colors ${
              statusFilter === 'confirmed' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setStatusFilter('shipped')}
            className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-colors ${
              statusFilter === 'shipped' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Shipped
          </button>
          <button
            onClick={() => setStatusFilter('delivered')}
            className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-colors ${
              statusFilter === 'delivered' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Delivered
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Courier & Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filtered.map((ord) => (
                <tr key={ord.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-gray-900 block">#{ord.id}</span>
                    <span className="text-[11px] text-gray-400">{ord.date}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-gray-900 block">{ord.customer}</span>
                    <span className="text-[11px] text-gray-500 flex items-center gap-1 font-mono">
                      <FiPhone size={10} /> {ord.phone}
                    </span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">
                      {ord.city}, {ord.district}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-700 max-w-xs truncate">{ord.items}</td>
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    {formatCurrency(ord.total)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-gray-100 text-gray-700">
                      {ord.paymentMethod}
                    </span>
                    {ord.isVerified && (
                      <span className="block text-[9px] text-emerald-600 font-bold mt-1">
                        ✓ Phone Verified
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-1.5">
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className={`text-[11px] font-bold py-1 px-2.5 rounded-lg border focus:outline-none cursor-pointer ${
                          ord.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : ord.status === 'shipped'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : ord.status === 'confirmed'
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            : 'bg-primary-50 text-primary-700 border-primary-200'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      {/* Courier Tracking Badge */}
                      {ord.trackingNumber ? (
                        <div className="flex items-center gap-1 text-[10px] text-blue-600 font-mono font-bold">
                          <FiTruck size={11} /> {ord.courierProvider?.toUpperCase()}: {ord.trackingNumber}
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedOrderForCourier(ord)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-md border border-indigo-200 transition-colors"
                        >
                          <FiSend size={10} /> Ship Courier
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/orders/${ord.id}/invoice`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        title="Print Invoice / Packing Slip"
                      >
                        <FiPrinter size={15} />
                      </Link>
                      <a
                        href={`https://wa.me/88${ord.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                          ord.customer
                        )},%20this%20is%20Shapla%20Fashion%20regarding%20your%20order%20%23${ord.id}.`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                        title="Message on WhatsApp"
                      >
                        <FaWhatsapp size={16} />
                      </a>
                      <Link
                        href={`/track-order?id=${ord.id}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700"
                        title="View Public Tracking Page"
                      >
                        <FiExternalLink size={15} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Courier Dispatch Modal */}
      {selectedOrderForCourier && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
                  <FiTruck size={16} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900">Ship with Courier</h3>
                  <p className="text-[11px] text-gray-400 font-mono">Order #{selectedOrderForCourier.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrderForCourier(null)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1">
                <p><span className="text-gray-400">Recipient:</span> <strong className="text-gray-800">{selectedOrderForCourier.customer}</strong> ({selectedOrderForCourier.phone})</p>
                <p><span className="text-gray-400">Destination:</span> {selectedOrderForCourier.city}, {selectedOrderForCourier.district}</p>
                <p>
                  <span className="text-gray-400">COD Collection:</span>{' '}
                  <strong className="text-primary-600">
                    {selectedOrderForCourier.paymentMethod === 'COD'
                      ? formatCurrency(selectedOrderForCourier.total)
                      : '৳0 (Prepaid)'}
                  </strong>
                </p>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1.5">Select Courier Service</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCourierProvider('steadfast')}
                    className={`py-2.5 px-3 rounded-xl font-bold border text-center transition-all ${
                      courierProvider === 'steadfast'
                        ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-xs'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Steadfast Courier
                  </button>
                  <button
                    type="button"
                    onClick={() => setCourierProvider('pathao')}
                    className={`py-2.5 px-3 rounded-xl font-bold border text-center transition-all ${
                      courierProvider === 'pathao'
                        ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-xs'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Pathao Courier
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Delivery Instruction / Note</label>
                <input
                  type="text"
                  placeholder="e.g. Fragile craft item, deliver afternoon"
                  value={courierNote}
                  onChange={(e) => setCourierNote(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForCourier(null)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBookCourier}
                  disabled={bookingLoading}
                  className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                >
                  {bookingLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <FiSend size={12} /> Confirm & Ship
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
