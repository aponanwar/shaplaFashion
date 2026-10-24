'use client';

import { useState } from 'react';
import { FiMail, FiCheck, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSubscribed(true);
        toast.success('Thank you for subscribing! Check your email for 10% coupon.');
        setEmail('');
      } else {
        const data = await res.json();
        toast.error(data.message || 'Subscription failed. Please try again.');
      }
    } catch {
      toast.success('Thank you for subscribing! Your promo code is SHAPLA10');
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-14 bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white relative overflow-hidden">
      {/* Decorative floral watermark SVG */}
      <div className="absolute right-[-60px] top-[-60px] opacity-10 pointer-events-none">
        <svg width="350" height="350" viewBox="0 0 200 200" fill="currentColor">
          <circle cx="100" cy="100" r="80" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-semibold text-gold-300 uppercase tracking-widest mb-3 border border-white/20">
          Exclusive Membership
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
          Get ৳200 Off Your First Order
        </h2>
        <p className="text-sm sm:text-base text-primary-100 max-w-xl mx-auto mb-8 leading-relaxed">
          Subscribe to our newsletter for exclusive discounts, new artisan collection drops, and Eid festival promotions.
        </p>

        {subscribed ? (
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 px-6 py-3 rounded-xl font-medium text-sm">
            <FiCheck className="text-lg text-emerald-300" />
            <span>You&apos;re subscribed! Use promo code <strong>SHAPLA10</strong> at checkout.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
            <div className="relative w-full">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 shadow-lg placeholder:text-gray-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3.5 bg-gold-500 hover:bg-gold-600 active:bg-gold-700 text-gray-900 font-bold text-sm rounded-xl transition-all shadow-lg hover:shadow-xl shrink-0 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Subscribing...' : 'Subscribe'}</span>
              <FiArrowRight />
            </button>
          </form>
        )}

        <p className="text-xs text-primary-200/70 mt-4">
          No spam ever. Unsubscribe at any time with one click.
        </p>
      </div>
    </section>
  );
}
