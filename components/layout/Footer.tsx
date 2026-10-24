'use client';

import Link from 'next/link';
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiArrowUp,
  FiHeart,
  FiShoppingBag,
  FiHelpCircle,
  FiShield,
  FiTruck,
} from 'react-icons/fi';
import { FaWhatsapp, FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const businessPhone = process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+880 1700-000000';
  const businessEmail = process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'support@shapla-fashion.com';
  const businessAddress = process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || 'House 12, Road 5, Dhanmondi, Dhaka 1205, Bangladesh';
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER || '+8801700000000';

  return (
    <footer className="bg-white border-t border-gray-200 pt-14 pb-8 text-gray-700">
      {/* Top features banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-gray-50 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
              <FiTruck className="text-2xl" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Nationwide Delivery</h4>
              <p className="text-xs text-gray-500">Dhaka in 24h, outside 2-4 days</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
              <FiShield className="text-2xl" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">100% Authentic</h4>
              <p className="text-xs text-gray-500">Pure handloom & artisan craft</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center shrink-0">
              <FiHeart className="text-2xl" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Crafted with Love</h4>
              <p className="text-xs text-gray-500">Supporting local Bangladeshi artisans</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
              <FaWhatsapp className="text-2xl" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Instant Support</h4>
              <p className="text-xs text-gray-500">WhatsApp assistant & phone</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-lg">
                🌸
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-gray-900 font-sans">
                Shapla<span className="text-primary-600">Fashion</span>
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-5 leading-relaxed max-w-sm">
              Authentic Bangladeshi fashion, traditional handloom sarees, tailored panjabi, modern kurtis, and timeless handmade crafts delivered to your doorstep.
            </p>
            <div className="space-y-2.5 text-sm text-gray-600">
              <div className="flex items-start gap-2.5">
                <FiMapPin className="text-primary-600 mt-1 shrink-0" />
                <span>{businessAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FiPhone className="text-primary-600 shrink-0" />
                <a href={`tel:${businessPhone}`} className="hover:text-primary-600 transition-colors">
                  {businessPhone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <FiMail className="text-primary-600 shrink-0" />
                <a href={`mailto:${businessEmail}`} className="hover:text-primary-600 transition-colors">
                  {businessEmail}
                </a>
              </div>
            </div>

            {/* Social media links */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href={process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary-600 hover:text-white transition-all"
                aria-label="Facebook"
              >
                <FaFacebookF size={14} />
              </a>
              <a
                href={process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary-600 hover:text-white transition-all"
                aria-label="Instagram"
              >
                <FaInstagram size={15} />
              </a>
              <a
                href={`https://wa.me/${waNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all flex items-center justify-center"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={16} />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4 border-b border-gray-100 pb-2">
              Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/products?category=sarees" className="hover:text-primary-600 transition-colors">
                  Handloom Sarees
                </Link>
              </li>
              <li>
                <Link href="/products?category=panjabi" className="hover:text-primary-600 transition-colors">
                  Men&apos;s Panjabi
                </Link>
              </li>
              <li>
                <Link href="/products?category=kurti" className="hover:text-primary-600 transition-colors">
                  Women&apos;s Kurtis
                </Link>
              </li>
              <li>
                <Link href="/products?category=salwar-kameez" className="hover:text-primary-600 transition-colors">
                  Salwar Kameez
                </Link>
              </li>
              <li>
                <Link href="/products?category=jute-crafts" className="hover:text-primary-600 transition-colors">
                  Jute Craft & Bags
                </Link>
              </li>
              <li>
                <Link href="/products?category=pottery" className="hover:text-primary-600 transition-colors">
                  Clay Pottery & Decor
                </Link>
              </li>
              <li>
                <Link href="/products?category=nakshi-kantha" className="hover:text-primary-600 transition-colors">
                  Nakshi Kantha
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4 border-b border-gray-100 pb-2">
              Customer Care
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/track-order" className="hover:text-primary-600 transition-colors font-semibold text-primary-600">
                  Track Your Order (লাইভ ট্র্যাকিং)
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-primary-600 transition-colors">
                  View Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-primary-600 transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-primary-600 transition-colors">
                  Checkout & Payment
                </Link>
              </li>
              <li>
                <span className="text-gray-400 cursor-not-allowed">
                  Return & Refund Policy (7 Days)
                </span>
              </li>
              <li>
                <span className="text-gray-400 cursor-not-allowed">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4 border-b border-gray-100 pb-2">
              Payment Methods
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              We accept safe and convenient payment options across Bangladesh:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <div className="px-3 py-2 bg-pink-50 text-pink-700 rounded-lg border border-pink-200 text-center">
                bKash
              </div>
              <div className="px-3 py-2 bg-orange-50 text-orange-700 rounded-lg border border-orange-200 text-center">
                Nagad
              </div>
              <div className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 text-center">
                Visa / Master
              </div>
              <div className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 text-center">
                Cash On Deliv.
              </div>
            </div>

            <div className="mt-5 p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600">
              <span className="font-semibold text-gray-900 block mb-1">🔐 100% Secure Checkout</span>
              End-to-end encrypted transactions and instant order confirmation via SMS & WhatsApp.
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Shapla Fashion Ltd. All rights reserved. Made for Bangladesh.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-primary-600 hover:text-white transition-all text-xs font-medium"
            >
              <span>Back to Top</span>
              <FiArrowUp />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
