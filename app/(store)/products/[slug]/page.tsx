'use client';

import { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  FiShoppingCart,
  FiHeart,
  FiTruck,
  FiShield,
  FiRotateCcw,
  FiCheck,
  FiShare2,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import SizeColorPicker from '@/components/product/SizeColorPicker';
import ReviewSection from '@/components/product/ReviewSection';
import { StarRating } from '@/components/ui/StarRating';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { formatCurrency, calculateDiscount } from '@/lib/utils';
import toast from 'react-hot-toast';

// Demo product database for instant SSR and fallback
const DEMO_CATALOG: Record<string, any> = {
  'handloom-cotton-jamdani-saree': {
    id: 'p1',
    name: 'Traditional Handloom Cotton Jamdani Saree',
    slug: 'handloom-cotton-jamdani-saree',
    price: 3200,
    discountPrice: 2499,
    category: 'Handloom Sarees',
    categorySlug: 'sarees',
    stock: 14,
    sku: 'JAM-COT-001',
    rating: 4.9,
    reviewCount: 38,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80',
    ],
    sizes: ['Free Size (12 Haath)'],
    colors: ['Maroon & Gold', 'Black & Silver', 'Royal Blue'],
    shortDescription:
      'Authentic Tangail woven Jamdani saree made from pure combed cotton with hand-spun metallic zari motifs.',
    description: `This exquisite Jamdani saree is crafted by master handloom weavers in Tangail, Bangladesh. Featuring timeless floral geometric motifs woven directly on the loom using the supplementary weft technique.
    
• 100% Breathable high-thread-count cotton
• Traditional Dhakai Jamdani floral palla
• Includes unstitched matching blouse piece (80cm)
• Gentle hand wash in cold water or dry clean recommended
• Supports rural handloom artisan clusters`,
  },
  'royal-muslin-panjabi': {
    id: 'p2',
    name: 'Royal Muslin Embroidered Panjabi',
    slug: 'royal-muslin-panjabi',
    price: 2400,
    discountPrice: 1950,
    category: 'Men’s Panjabi',
    categorySlug: 'panjabi',
    stock: 20,
    sku: 'PAN-MUS-002',
    rating: 4.8,
    reviewCount: 29,
    images: [
      'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=800&q=80',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&q=80',
    ],
    sizes: ['38', '40', '42', '44'],
    colors: ['White', 'Pastel Cream', 'Navy Blue'],
    shortDescription:
      'Handcrafted premium muslin cotton panjabi with delicate geometric collar embroidery and mother-of-pearl buttons.',
    description: `Tailored to perfection for festive occasions, Eid celebrations, and formal gatherings. Made with premium fine-spun cotton muslin that keeps you cool and elegant throughout the day.
    
• Mandarin collar with subtle thread embroidery
• Concealed front placket with mother-of-pearl buttons
• Dual side pockets
• Regular comfortable silhouette`,
  },
  'handcrafted-jute-tote-bag': {
    id: 'p3',
    name: 'Handcrafted Eco Jute Tote Bag',
    slug: 'handcrafted-jute-tote-bag',
    price: 650,
    discountPrice: 499,
    category: 'Jute Bags & Crafts',
    categorySlug: 'jute-crafts',
    stock: 35,
    sku: 'JUT-TOT-003',
    rating: 4.7,
    reviewCount: 42,
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    ],
    sizes: ['Standard (16" x 14" x 5")'],
    colors: ['Natural Beige', 'Olive Green Accents'],
    shortDescription:
      'Eco-friendly golden fiber tote bag reinforced with vegan leather handles and block-printed cotton lining.',
    description: `Proudly made from 100% natural Bangladeshi Golden Fiber (Jute). Spacious, durable, and stylish for daily grocery runs, university, or weekend outings.
    
• High-density woven biodegradable jute
• Water-resistant laminated interior
• Sturdy double stitched padded handles
• Interior zipper pocket for phone and keys`,
  },
};

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // Find in demo catalog or fallback to first
  const product = DEMO_CATALOG[slug] || {
    id: 'demo-p',
    name: slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    slug,
    price: 1800,
    discountPrice: 1450,
    category: 'Clothes & Crafts',
    categorySlug: 'clothes',
    stock: 15,
    sku: `SKU-${slug.slice(0, 6).toUpperCase()}`,
    rating: 4.8,
    reviewCount: 16,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Maroon', 'Beige', 'Black'],
    shortDescription:
      'Handcrafted authentic Bangladeshi garment designed with premium materials and traditional artisan techniques.',
    description:
      'Experience the heritage of Bangladeshi fashion with our artisanal creations. Breathable fabric, tailored comfort, and durable craftsmanship.',
  };

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews' | 'delivery'>('desc');

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const { toggle, isWishlisted } = useWishlistStore();

  const discountPercent = calculateDiscount(product.price, product.discountPrice);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      discountPrice: product.discountPrice,
      quantity,
      size: selectedSize,
      color: selectedColor,
      sku: product.sku,
      stock: product.stock,
    });
    toast.success(`Added ${product.name} to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    openCart();
  };

  const handleWhatsAppOrder = () => {
    const waNumber = (process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER || '+8801700000000').replace(/[^0-9]/g, '');
    const currentPrice = product.discountPrice || product.price;
    const msg = `Hello Shapla Fashion! I want to order:\n\n*Product:* ${product.name}\n*Price:* ৳${currentPrice}\n*Size:* ${selectedSize || 'Standard'}\n*Color:* ${selectedColor || 'Standard'}\n*Quantity:* ${quantity}\n\nPlease confirm availability and delivery!`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary-600">Products</Link>
          <span>/</span>
          <Link href={`/products?category=${product.categorySlug}`} className="hover:text-primary-600">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Details Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-6">
            <ProductImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Right: Info & Purchase Controls */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="border-b border-gray-100 pb-5 mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md">
                {product.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2 leading-tight">
                {product.name}
              </h1>

              {/* Rating & Stock */}
              <div className="flex items-center gap-4 mt-3">
                <StarRating rating={product.rating} reviewCount={product.reviewCount} size="sm" />
                <span className="text-gray-300">|</span>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <FiCheck /> In Stock ({product.stock} available)
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-xs text-gray-400 font-mono">SKU: {product.sku}</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <span className="text-3xl font-extrabold text-primary-600">
                {formatCurrency(product.discountPrice || product.price)}
              </span>
              {product.discountPrice && (
                <>
                  <span className="text-base text-gray-400 line-through">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary-600 text-white">
                    Save {discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Size & Color Picker */}
            <div className="mb-6">
              <SizeColorPicker
                sizes={product.sizes}
                colors={product.colors}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                onSelectSize={setSelectedSize}
                onSelectColor={setSelectedColor}
              />
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-semibold text-gray-900">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-lg font-bold"
                >
                  -
                </button>
                <span className="w-12 text-center text-sm font-bold text-gray-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full py-3.5 px-6 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary-200 transition-all"
                >
                  <FiShoppingCart className="text-lg" />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-6 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <span>Buy Now (Fast Checkout)</span>
                </button>
              </div>

              {/* Direct WhatsApp Order */}
              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="w-full py-3 px-6 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 border border-green-300 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <FaWhatsapp className="text-green-600 text-lg" />
                <span>Order via WhatsApp Direct</span>
              </button>

              <div className="flex items-center justify-center gap-6 pt-2">
                <button
                  onClick={() =>
                    toggle({
                      productId: product.id,
                      name: product.name,
                      image: product.images[0],
                      price: product.price,
                      discountPrice: product.discountPrice,
                      slug: product.slug,
                    })
                  }
                  className={`text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    wishlisted ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <FiHeart className={wishlisted ? 'fill-primary-600' : ''} />
                  <span>{wishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: product.name, url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success('Link copied to clipboard!');
                    }
                  }}
                  className="text-xs text-gray-500 hover:text-gray-900 font-semibold flex items-center gap-1.5"
                >
                  <FiShare2 />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Trust highlights */}
            <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-3 gap-2 text-center text-xs text-gray-600">
              <div className="p-2 rounded-lg bg-gray-50">
                <FiTruck className="mx-auto text-primary-600 text-base mb-1" />
                <span className="font-semibold block text-gray-900">COD Available</span>
                <span>Pay when received</span>
              </div>
              <div className="p-2 rounded-lg bg-gray-50">
                <FiRotateCcw className="mx-auto text-primary-600 text-base mb-1" />
                <span className="font-semibold block text-gray-900">7 Days Return</span>
                <span>Easy exchange</span>
              </div>
              <div className="p-2 rounded-lg bg-gray-50">
                <FiShield className="mx-auto text-primary-600 text-base mb-1" />
                <span className="font-semibold block text-gray-900">Pure Quality</span>
                <span>Authentic items</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Info & Reviews */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex border-b border-gray-200 gap-8 mb-6">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === 'desc'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Description & Craftsmanship
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === 'reviews'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Customer Reviews ({product.reviewCount})
            </button>
            <button
              onClick={() => setActiveTab('delivery')}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === 'delivery'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Delivery & Returns
            </button>
          </div>

          {activeTab === 'desc' && (
            <div className="prose max-w-none text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          )}

          {activeTab === 'reviews' && (
            <ReviewSection
              productId={product.id}
              averageRating={product.rating}
              reviewCount={product.reviewCount}
            />
          )}

          {activeTab === 'delivery' && (
            <div className="space-y-4 text-sm text-gray-600">
              <h4 className="font-bold text-gray-900">Delivery Guidelines:</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Inside Dhaka Metro:</strong> Delivered within 24-48 hours via local courier (৳60 delivery charge).</li>
                <li><strong>Outside Dhaka (Nationwide):</strong> Delivered within 3-5 business days via Steadfast / Sundarban courier (৳120 delivery charge).</li>
                <li><strong>Free Shipping:</strong> Automatically applied to orders with subtotal above ৳999 within Dhaka!</li>
                <li><strong>Cash on Delivery:</strong> Available across all 64 districts of Bangladesh.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
