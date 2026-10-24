'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FiDollarSign,
  FiShoppingBag,
  FiPackage,
  FiAlertTriangle,
  FiArrowUpRight,
  FiCheckCircle,
  FiClock,
  FiTruck,
} from 'react-icons/fi';
import { formatCurrency } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const SALES_DATA = [
  { day: 'Sat', sales: 12500, orders: 8 },
  { day: 'Sun', sales: 18200, orders: 12 },
  { day: 'Mon', sales: 15400, orders: 9 },
  { day: 'Tue', sales: 24300, orders: 15 },
  { day: 'Wed', sales: 31000, orders: 18 },
  { day: 'Thu', sales: 28500, orders: 16 },
  { day: 'Fri', sales: 42000, orders: 24 },
];

const RECENT_ORDERS = [
  {
    id: 'SF26109921',
    customer: 'Nusrat Jahan',
    phone: '01711223344',
    items: 'Handloom Cotton Jamdani Saree (1)',
    total: 2559,
    status: 'pending',
    paymentMethod: 'COD',
    time: '10 mins ago',
  },
  {
    id: 'SF26108422',
    customer: 'Tanvir Ahmed',
    phone: '01899887766',
    items: 'Royal Muslin Panjabi (2)',
    total: 3960,
    status: 'confirmed',
    paymentMethod: 'bKash',
    time: '45 mins ago',
  },
  {
    id: 'SF26107310',
    customer: 'Farhana Kabir',
    phone: '01922334455',
    items: 'Handcrafted Eco Jute Tote Bag (2), Pottery Vase (1)',
    total: 1898,
    status: 'shipped',
    paymentMethod: 'Nagad',
    time: '2 hours ago',
  },
  {
    id: 'SF26106200',
    customer: 'Rafiqul Islam',
    phone: '01655443322',
    items: 'Block Print Kurti (1)',
    total: 859,
    status: 'delivered',
    paymentMethod: 'Card',
    time: '5 hours ago',
  },
];

const LOW_STOCK_ITEMS = [
  { name: 'Pure Silk Dhakai Jamdani Saree', sku: 'JAM-SLK-009', stock: 2, threshold: 5 },
  { name: 'Hand-painted Folk Wall Hanging', sku: 'CRA-ART-004', stock: 3, threshold: 5 },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Total Revenue
            </span>
            <span className="text-2xl font-black text-gray-900 mt-1 block">
              ৳1,71,900
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <FiArrowUpRight /> +18.4% from last week
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-xl shrink-0">
            <FiDollarSign />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Total Orders
            </span>
            <span className="text-2xl font-black text-gray-900 mt-1 block">
              102 Orders
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <FiArrowUpRight /> 14 new today
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
            <FiPackage />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Active Products
            </span>
            <span className="text-2xl font-black text-gray-900 mt-1 block">
              24 Items
            </span>
            <span className="text-[11px] font-semibold text-gray-500 mt-1 block">
              Clothes & Homemade Crafts
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center text-xl shrink-0">
            <FiShoppingBag />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Inventory Alerts
            </span>
            <span className="text-2xl font-black text-red-600 mt-1 block">
              2 Low Stock
            </span>
            <Link
              href="/admin/inventory"
              className="text-[11px] font-bold text-primary-600 hover:underline mt-1 block"
            >
              Restock Now &rarr;
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-xl shrink-0">
            <FiAlertTriangle />
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-gray-900">Weekly Revenue & Sales Trend</h2>
            <p className="text-xs text-gray-500 mt-0.5">Performance over the past 7 days across Bangladesh</p>
          </div>
          <span className="text-xs font-bold bg-primary-50 text-primary-700 px-3 py-1 rounded-full">
            Average ৳24.5k / day
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={SALES_DATA}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C41E3A" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C41E3A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#9ca3af" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#9ca3af"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => `৳${v / 1000}k`}
              />
              <Tooltip
                formatter={(value: any) => [`৳${Number(value).toLocaleString('en-BD')}`, 'Revenue']}
                contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #e5e7eb' }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#C41E3A"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorSales)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two columns: Recent Orders & Inventory Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-base text-gray-900">Recent Customer Orders</h3>
              <p className="text-xs text-gray-500">Latest orders placed on your shop</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-primary-600 hover:text-primary-700"
            >
              View All Orders &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 font-bold border-b border-gray-100 uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {RECENT_ORDERS.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 font-mono font-bold text-gray-900">#{ord.id}</td>
                    <td className="py-3">
                      <div className="font-bold text-gray-900">{ord.customer}</div>
                      <div className="text-[11px] text-gray-400">{ord.phone}</div>
                    </td>
                    <td className="py-3 font-bold text-gray-900">{formatCurrency(ord.total)}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-gray-100 text-gray-700">
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] capitalize ${
                          ord.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-700'
                            : ord.status === 'shipped'
                            ? 'bg-blue-50 text-blue-700'
                            : ord.status === 'confirmed'
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-primary-50 text-primary-700'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href="/admin/orders"
                        className="text-xs font-semibold text-primary-600 hover:underline"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-gray-100">
              <FiAlertTriangle className="text-red-500 text-lg" />
              <h3 className="font-bold text-base text-gray-900">Low Stock Warnings</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              The following products are below their minimum threshold (5 units) and need restocking.
            </p>

            <div className="space-y-3">
              {LOW_STOCK_ITEMS.map((item) => (
                <div
                  key={item.sku}
                  className="p-3.5 rounded-xl border border-red-200 bg-red-50/50 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-xs text-gray-900">{item.name}</h4>
                    <span className="text-[10px] font-mono text-gray-400 block mt-0.5">
                      SKU: {item.sku}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-red-600 block">
                      {item.stock} left
                    </span>
                    <span className="text-[10px] text-gray-400">Min: {item.threshold}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <Link
              href="/admin/inventory"
              className="w-full py-3 px-4 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold text-center block transition-all"
            >
              Open Inventory Management
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
