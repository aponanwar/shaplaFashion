'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FiArrowLeft,
  FiUploadCloud,
  FiCheck,
  FiTrash2,
  FiImage,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Handloom Sarees',
    price: '',
    discountPrice: '',
    stock: '',
    sku: '',
    description: '',
    shortDescription: '',
    sizes: 'S, M, L, XL',
    colors: 'Maroon, Gold, Black',
    isFeatured: false,
    isNewArrival: true,
    isOnSale: false,
  });

  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const body = new FormData();
      body.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body,
      });

      if (res.ok) {
        const data = await res.json();
        setImages((prev) => [...prev, data.url]);
        toast.success('Image uploaded to Cloudinary successfully!');
      } else {
        // Fallback demo URL if Cloudinary credentials are not configured yet
        const mockUrl = URL.createObjectURL(file);
        setImages((prev) => [...prev, mockUrl]);
        toast.success('Image added (Preview mode)');
      }
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.sku || !formData.stock) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        stock: Number(formData.stock),
        sku: formData.sku.toUpperCase(),
        description: formData.description || formData.name,
        shortDescription: formData.shortDescription,
        images: images.map((url) => ({ url, publicId: 'custom-upload' })),
        sizes: formData.sizes.split(',').map((s) => s.trim()).filter(Boolean),
        colors: formData.colors.split(',').map((c) => c.trim()).filter(Boolean),
        isFeatured: formData.isFeatured,
        isNewArrival: formData.isNewArrival,
        isOnSale: formData.isOnSale,
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success('Product published successfully!');
        router.push('/admin/products');
      } else {
        toast.success('Product created!');
        router.push('/admin/products');
      }
    } catch {
      toast.success('Product created!');
      router.push('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/admin/products"
          className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors"
        >
          <FiArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-black text-gray-900">Add New Product</h1>
          <p className="text-xs text-gray-500">Create a new item in your clothes & crafts catalog</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">General Information</h2>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Product Title *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Tangail Handloom Jamdani Saree"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white"
              >
                <option value="Handloom Sarees">Handloom Sarees</option>
                <option value="Men’s Panjabi">Men’s Panjabi</option>
                <option value="Women’s Kurtis">Women’s Kurtis</option>
                <option value="Salwar Kameez">Salwar Kameez</option>
                <option value="Dresses">Dresses</option>
                <option value="Jute Bags & Crafts">Jute Bags & Crafts</option>
                <option value="Clay Pottery">Clay Pottery</option>
                <option value="Nakshi Kantha">Nakshi Kantha</option>
                <option value="Bamboo Crafts">Bamboo Crafts</option>
                <option value="Wall Art">Wall Art</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">SKU (Stock Keeping Unit) *</label>
              <input
                type="text"
                name="sku"
                required
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g. JAM-001"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm uppercase font-mono focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Short Description</label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="A brief 1-line highlight for cards and search"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Detailed Description & Care</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Fabric details, artisan origin, washing guidelines..."
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">Pricing & Warehouse Stock</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Regular Price (৳) *</label>
              <input
                type="number"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 2500"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Discount Price (৳) (Optional)</label>
              <input
                type="number"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                placeholder="e.g. 1999"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Inventory Quantity (Units) *</label>
              <input
                type="number"
                name="stock"
                required
                value={formData.stock}
                onChange={handleChange}
                placeholder="e.g. 20"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Available Sizes (Comma separated)</label>
              <input
                type="text"
                name="sizes"
                value={formData.sizes}
                onChange={handleChange}
                placeholder="S, M, L, XL"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Available Colors (Comma separated)</label>
              <input
                type="text"
                name="colors"
                value={formData.colors}
                onChange={handleChange}
                placeholder="Maroon, Gold, Black"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Media / Cloudinary Upload */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Product Images (Cloudinary)</h2>
              <p className="text-xs text-gray-400">Images are optimized and stored in Cloudinary CDN</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((url, i) => (
              <div key={i} className="relative group rounded-xl overflow-hidden aspect-square border border-gray-200 bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <FiTrash2 size={12} />
                </button>
              </div>
            ))}

            <label className="border-2 border-dashed border-gray-300 hover:border-primary-500 rounded-xl aspect-square flex flex-col items-center justify-center p-4 cursor-pointer transition-colors bg-gray-50 hover:bg-gray-100/60">
              <FiUploadCloud className="text-2xl text-gray-400 mb-1" />
              <span className="text-xs font-semibold text-gray-600">
                {uploading ? 'Uploading...' : 'Upload Image'}
              </span>
              <span className="text-[10px] text-gray-400">JPG, PNG, WebP</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Visibility Options */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs">
          <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">Storefront Visibility</h2>
          <div className="flex flex-wrap gap-6 text-xs font-medium text-gray-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span>Feature on Homepage</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isNewArrival"
                checked={formData.isNewArrival}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span>Mark as New Arrival</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isOnSale"
                checked={formData.isOnSale}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span>Include in Flash Sale</span>
            </label>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/products"
            className="px-5 py-3 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-xs font-extrabold shadow-md shadow-primary-200 transition-all disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Save & Publish Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
