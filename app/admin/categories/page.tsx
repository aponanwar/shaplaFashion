'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  FiPlus,
  FiSearch,
  FiTrash2,
  FiEdit3,
  FiCheck,
  FiX,
  FiUploadCloud,
  FiLayers,
  FiFolderPlus,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  order: number;
  createdAt?: string;
}

const DEMO_CATEGORIES_FALLBACK: CategoryItem[] = [
  { _id: '1', name: 'Handloom Sarees', slug: 'sarees', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80', description: 'Heritage Jamdani, Silk & Cotton Sarees', isActive: true, order: 1 },
  { _id: '2', name: 'Men’s Panjabi', slug: 'panjabi', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80', description: 'Traditional and festive Panjabis', isActive: true, order: 2 },
  { _id: '3', name: 'Women’s Kurtis', slug: 'kurti', image: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=600&q=80', description: 'Comfortable daily and festive wear kurtis', isActive: true, order: 3 },
  { _id: '4', name: 'Salwar Kameez', slug: 'salwar-kameez', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80', description: 'Two-piece and three-piece sets', isActive: true, order: 4 },
  { _id: '5', name: 'Jute Crafts & Bags', slug: 'jute-crafts', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', description: 'Handcrafted eco jute bags & lifestyle items', isActive: true, order: 5 },
  { _id: '6', name: 'Wall Art & Nakshi Kantha', slug: 'wall-art', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80', description: 'Traditional embroidery and folk wall art', isActive: true, order: 6 },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
    isActive: true,
    order: 0,
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
          return;
        }
      }
      setCategories(DEMO_CATEGORIES_FALLBACK);
    } catch {
      setCategories(DEMO_CATEGORIES_FALLBACK);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData((prev) => ({ ...prev, name, slug: generatedSlug }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('folder', 'shapla-fashion/categories');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) throw new Error('Upload failed');
      const resData = await res.json();
      setFormData((prev) => ({ ...prev, image: resData.url }));
      toast.success('Category image uploaded to Cloudinary!');
    } catch (err: any) {
      toast.error('Image upload failed. Using fallback URL.');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create category');
      }

      const data = await res.json();
      toast.success(`Category "${formData.name}" created!`);
      setCategories((prev) => [data.category, ...prev]);
      setShowAddModal(false);
      setFormData({
        name: '',
        slug: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
        isActive: true,
        order: categories.length + 1,
      });
    } catch (err: any) {
      toast.error(err.message || 'Error creating category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success(`Category "${name}" deleted`);
        setCategories((prev) => prev.filter((c) => c._id !== id));
      } else {
        toast.error('Failed to delete category');
      }
    } catch {
      toast.error('Error deleting category');
    }
  };

  const handleToggleStatus = async (cat: CategoryItem) => {
    try {
      const newStatus = !cat.isActive;
      const res = await fetch('/api/admin/categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cat._id, isActive: newStatus }),
      });

      if (res.ok) {
        toast.success(`Category marked as ${newStatus ? 'Active' : 'Inactive'}`);
        setCategories((prev) =>
          prev.map((c) => (c._id === cat._id ? { ...c, isActive: newStatus } : c))
        );
      }
    } catch {
      toast.error('Failed to update category status');
    }
  };

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">Categories Management</h1>
          <p className="text-xs text-gray-500 mt-1">
            Organize products by categories, assign banner thumbnails, and manage visibility.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md shadow-primary-600/20 transition-all active:scale-95 self-start sm:self-auto"
        >
          <FiFolderPlus size={16} /> Add New Category
        </button>
      </div>

      {/* Search & Stats */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 self-end sm:self-auto">
          <span>Total Categories: <strong className="text-gray-900">{categories.length}</strong></span>
          <span>Active: <strong className="text-emerald-600">{categories.filter(c => c.isActive).length}</strong></span>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500">Loading categories...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            No categories found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Slug</th>
                  <th className="px-5 py-3.5">Description</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((cat) => (
                  <tr key={cat._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                          <Image
                            src={cat.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100&q=80'}
                            alt={cat.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 block text-sm">{cat.name}</span>
                          <span className="text-[10px] text-gray-400">Order: #{cat.order || 0}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <code className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md font-mono text-[11px]">
                        /{cat.slug}
                      </code>
                    </td>

                    <td className="px-5 py-4 text-gray-500 max-w-xs truncate">
                      {cat.description || '—'}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(cat)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                          cat.isActive
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${cat.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDelete(cat._id, cat.name)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete category"
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
        )}
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FiFolderPlus className="text-primary-600" size={20} />
                <h3 className="font-extrabold text-base text-gray-900">Add New Category</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Traditional Jamdani Sarees"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">URL Slug</label>
                <input
                  type="text"
                  placeholder="e.g. traditional-jamdani-sarees"
                  value={formData.slug}
                  onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-mono text-gray-600 bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief description of products in this category..."
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              {/* Image Upload / URL */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Category Thumbnail</label>
                <div className="flex items-center gap-3 mb-2">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                    <Image
                      src={formData.image}
                      alt="Category preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors">
                      <FiUploadCloud size={16} />
                      {uploading ? 'Uploading to Cloudinary...' : 'Upload Image'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] text-gray-400 mt-1">Direct upload to Cloudinary storage or paste URL below.</p>
                  </div>
                </div>
                <input
                  type="url"
                  placeholder="Or paste image URL"
                  value={formData.image}
                  onChange={(e) => setFormData((p) => ({ ...p, image: e.target.value }))}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                    className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                  />
                  Visible on Storefront (Active)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-md shadow-primary-600/20 flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
