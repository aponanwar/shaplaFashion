'use client';

import { FiStar } from 'react-icons/fi';
import { FaQuoteLeft } from 'react-icons/fa';

interface Review {
  name: string;
  location: string;
  comment: string;
  rating: number;
  product: string;
  verified: boolean;
}

const REVIEWS: Review[] = [
  {
    name: 'Nusrat Jahan',
    location: 'Gulshan, Dhaka',
    comment:
      'The Jamdani saree I ordered for my cousin’s wedding was breathtaking! The weave precision and fabric softness exceeded all my expectations.',
    rating: 5,
    product: 'Dhakai Jamdani Saree',
    verified: true,
  },
  {
    name: 'Tanvir Ahmed',
    location: 'Chittagong',
    comment:
      'I ordered 2 Panjabis for Eid. Fits true to size, premium stitching, and fast delivery via courier. Highly recommended!',
    rating: 5,
    product: 'Muslin Embroidered Panjabi',
    verified: true,
  },
  {
    name: 'Sabrina Rahman',
    location: 'Uttara, Dhaka',
    comment:
      'Loved the Jute storage tote and terracotta vases! They add such an authentic warm Bangladeshi heritage vibe to our living room.',
    rating: 5,
    product: 'Handwoven Jute Basket & Clay Vase',
    verified: true,
  },
];

export default function Testimonials() {
  return (
    <section className="py-14 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">
            Loved By Thousands
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
            What Our Customers Say
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Real feedback from fashion enthusiasts and home decorators across Bangladesh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow relative"
            >
              <FaQuoteLeft className="text-primary-100 text-3xl mb-3" />
              <p className="text-sm text-gray-700 leading-relaxed italic mb-6">
                &ldquo;{rev.comment}&rdquo;
              </p>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1 mb-1.5 text-gold-500">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <FiStar key={i} className="fill-gold-500" size={14} />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{rev.name}</h4>
                    <p className="text-xs text-gray-400">{rev.location}</p>
                  </div>
                  {rev.verified && (
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Verified Buyer
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
