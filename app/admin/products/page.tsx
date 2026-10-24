'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiCheck,
  FiShoppingBag,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/lib/utils';

interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sku: string;
  image: string;
  isActive: boolean;
}

const DEMO_PRODUCTS: AdminProduct[] = [
  {
    id: 'p-1',
    name: 'Traditional Handloom Cotton Jamdani Saree',
    slug: 'handloom-cotton-jamdani-saree',
    category: 'Handloom Sarees',
    price: 3200,
    discountPrice: 2499,
    stock: 14,
    sku: 'JAM-COT-001',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&q=80',
    isActive: true,
  },
  {
    id: 'p-2',
    name: 'Royal Muslin Embroidered Panjabi',
    slug: 'royal-muslin-panjabi',
    category: 'Men’s Panjabi',
    price: 2400,
    discountPrice: 1950,
    stock: 20,
    sku: 'PAN-MUS-002',
    image: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=300&q=80',
    isActive: true,
  },
  {
    id: 'p-3',
    name: 'Handcrafted Eco Jute Tote Bag',
    slug: 'handcrafted-jute-tote-bag',
    category: 'Jute Bags & Crafts',
    price: 650,
    discountPrice: 499,
    stock: 35,
    sku: 'JUT-TOT-003',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&q=80',
    isActive: true,
  },
  {
    id: 'p-4',
    name: 'Block Print Cotton Kurti',
    slug: 'organic-cotton-block-print-kurti',
    category: 'Women’s Kurtis',
    price: 950,
    discountPrice: 799,
    stock: 25,
    sku: 'KUR-BLK-004',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=300&q=80',
    isActive: true,
  },
  {
    id: 'p-5',
    name: 'Hand-painted Folk Wall Hanging',
    slug: 'hand-painted-folk-wall-hanging',
    category: 'Wall Art',
    price: 1800,
    discountPrice: 1550,
    stock: 3,
    sku: 'CRA-ART-005',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=300&q=80',
    isActive: true,
  },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>(DEMO_PRODUCTS);
  const [search, setSearch] = useState('');

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Product removed');
    }
  };

  const toggleStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
    toast.success('Status updated');
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">Products Catalog</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your clothes, handcrafted goods, prices, and online availability.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-md shadow-primary-200 transition-all shrink-0"
        >
          <FiPlus size={16} /> Add New Product
        </Link>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <span className="text-xs text-gray-400 font-medium">
          Showing {filtered.length} of {products.length} products
        </span>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Item</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4 text-center">Stock</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-gray-900 block truncate max-w-xs">{item.name}</span>
                        <span className="text-[11px] font-mono text-gray-400">SKU: {item.sku}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">{item.category}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-gray-900 block">
                      {formatCurrency(item.discountPrice || item.price)}
                    </span>
                    {item.discountPrice && (
                      <span className="text-[11px] text-gray-400 line-through">
                        {formatCurrency(item.price)}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold">
                    <span className={item.stock <= 5 ? 'text-red-600' : 'text-gray-900'}>
                      {item.stock}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => toggleStatus(item.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                        item.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {item.isActive ? 'Active' : 'Draft'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/products/${item.slug}`}
                        target="_blank"
                        className="p-1.5 text-gray-400 hover:text-gray-700"
                        title="View on store"
                      >
                        <FiEye size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete product"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
