'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FiLayers,
  FiSearch,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiPlus,
  FiMinus,
  FiDownload,
  FiRefreshCw,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  lowStockThreshold: number;
  price: number;
  lastUpdated: string;
}

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    name: 'Traditional Handloom Cotton Jamdani Saree',
    sku: 'JAM-COT-001',
    category: 'Sarees',
    stock: 14,
    lowStockThreshold: 5,
    price: 2499,
    lastUpdated: 'Today at 10:15 AM',
  },
  {
    id: 'inv-2',
    name: 'Royal Muslin Embroidered Panjabi',
    sku: 'PAN-MUS-002',
    category: 'Panjabi',
    stock: 20,
    lowStockThreshold: 5,
    price: 1950,
    lastUpdated: 'Today at 09:30 AM',
  },
  {
    id: 'inv-3',
    name: 'Handcrafted Eco Jute Tote Bag',
    sku: 'JUT-TOT-003',
    category: 'Jute Crafts',
    stock: 35,
    lowStockThreshold: 10,
    price: 499,
    lastUpdated: 'Yesterday',
  },
  {
    id: 'inv-4',
    name: 'Pure Silk Dhakai Jamdani Saree',
    sku: 'JAM-SLK-009',
    category: 'Sarees',
    stock: 2,
    lowStockThreshold: 5,
    price: 5800,
    lastUpdated: '2 days ago',
  },
  {
    id: 'inv-5',
    name: 'Hand-painted Folk Wall Hanging',
    sku: 'CRA-ART-004',
    category: 'Wall Art',
    stock: 3,
    lowStockThreshold: 5,
    price: 1550,
    lastUpdated: '3 days ago',
  },
  {
    id: 'inv-6',
    name: 'Clay Terracotta Vase Set (Pair)',
    sku: 'CRA-POT-005',
    category: 'Pottery',
    stock: 0,
    lowStockThreshold: 5,
    price: 850,
    lastUpdated: '4 days ago',
  },
  {
    id: 'inv-7',
    name: 'Traditional Nakshi Kantha Cushion Cover',
    sku: 'KAN-CUS-007',
    category: 'Nakshi Kantha',
    stock: 18,
    lowStockThreshold: 5,
    price: 650,
    lastUpdated: 'Today',
  },
];

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');

  const updateStock = (id: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStock = Math.max(0, item.stock + delta);
          return {
            ...item,
            stock: newStock,
            lastUpdated: 'Just now',
          };
        }
        return item;
      })
    );
    toast.success('Stock quantity updated');
  };

  const filteredItems = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'low') return item.stock > 0 && item.stock <= item.lowStockThreshold;
    if (filter === 'out') return item.stock === 0;
    return true;
  });

  const totalUnits = inventory.reduce((s, i) => s + i.stock, 0);
  const lowCount = inventory.filter((i) => i.stock > 0 && i.stock <= i.lowStockThreshold).length;
  const outCount = inventory.filter((i) => i.stock === 0).length;

  return (
    <div className="space-y-6">
      {/* Page Title & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <FiLayers className="text-primary-600" />
            <span>Inventory Management System</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track and update warehouse stock levels, set restock thresholds, and manage SKUs in real time.
          </p>
        </div>

        <button
          onClick={() => {
            const csv = [
              ['SKU', 'Product Name', 'Category', 'Stock', 'Threshold', 'Price'],
              ...inventory.map((i) => [i.sku, `"${i.name}"`, i.category, i.stock, i.lowStockThreshold, i.price]),
            ].map((e) => e.join(',')).join('\n');

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `shapla_inventory_${new Date().toISOString().slice(0, 10)}.csv`;
            a.click();
            toast.success('Inventory report exported as CSV!');
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-xs transition-colors shrink-0"
        >
          <FiDownload /> Export CSV
        </button>
      </div>

      {/* Stock Health Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setFilter('all')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            filter === 'all'
              ? 'border-primary-600 bg-primary-50/50 ring-1 ring-primary-600'
              : 'border-gray-200 bg-white hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Total Stocked Units</span>
            <FiCheckCircle className="text-emerald-500" />
          </div>
          <span className="text-2xl font-black text-gray-900 mt-1 block">{totalUnits} Units</span>
          <span className="text-[11px] text-gray-400">Across {inventory.length} catalog items</span>
        </div>

        <div
          onClick={() => setFilter('low')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            filter === 'low'
              ? 'border-yellow-500 bg-yellow-50/50 ring-1 ring-yellow-500'
              : 'border-gray-200 bg-white hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Low Stock Alert</span>
            <FiAlertTriangle className="text-yellow-500" />
          </div>
          <span className="text-2xl font-black text-yellow-600 mt-1 block">{lowCount} Products</span>
          <span className="text-[11px] text-gray-400">Stock &le; 5 units threshold</span>
        </div>

        <div
          onClick={() => setFilter('out')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            filter === 'out'
              ? 'border-red-500 bg-red-50/50 ring-1 ring-red-500'
              : 'border-gray-200 bg-white hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Out of Stock</span>
            <FiXCircle className="text-red-500" />
          </div>
          <span className="text-2xl font-black text-red-600 mt-1 block">{outCount} Products</span>
          <span className="text-[11px] text-gray-400">Requires urgent restocking</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <span className="text-gray-400 font-medium">Filter:</span>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              filter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({inventory.length})
          </button>
          <button
            onClick={() => setFilter('low')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              filter === 'low' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Low Stock ({lowCount})
          </button>
          <button
            onClick={() => setFilter('out')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              filter === 'out' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Out of Stock ({outCount})
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-center">Stock Level</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4">Last Updated</th>
                <th className="py-3.5 px-4 text-center">Quick Stock Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredItems.map((item) => {
                const isOut = item.stock === 0;
                const isLow = !isOut && item.stock <= item.lowStockThreshold;

                return (
                  <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-800">{item.sku}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-gray-900 block">{item.name}</span>
                      <span className="text-[11px] text-gray-400">৳{item.price.toLocaleString('en-BD')}</span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">{item.category}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`font-black text-sm ${
                          isOut ? 'text-red-600' : isLow ? 'text-yellow-600' : 'text-gray-900'
                        }`}
                      >
                        {item.stock}
                      </span>
                      <span className="text-[10px] text-gray-400 block">Min: {item.lowStockThreshold}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isOut
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : isLow
                            ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Optimal'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-400 text-[11px]">{item.lastUpdated}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => updateStock(item.id, -1)}
                          disabled={item.stock === 0}
                          className="w-7 h-7 rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center justify-center text-gray-600 disabled:opacity-40"
                          title="Reduce 1"
                        >
                          <FiMinus size={12} />
                        </button>
                        <button
                          onClick={() => updateStock(item.id, 1)}
                          className="w-7 h-7 rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center justify-center text-gray-600"
                          title="Add 1"
                        >
                          <FiPlus size={12} />
                        </button>
                        <button
                          onClick={() => updateStock(item.id, 10)}
                          className="px-2 h-7 rounded-lg bg-gray-900 hover:bg-black text-white text-[11px] font-bold flex items-center justify-center"
                          title="Restock +10"
                        >
                          +10
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
