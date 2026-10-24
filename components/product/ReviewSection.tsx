'use client';

// components/product/ReviewSection.tsx
// Displays average rating summary, review list, and an add-review form (when logged in).

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiUser } from 'react-icons/fi';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string | Date;
}

interface ReviewSectionProps {
  productId: string;
  reviews?: Review[];
  averageRating?: number;
  reviewCount?: number;
  loading?: boolean;
  onAddReview?: (rating: number, comment: string) => Promise<void>;
}

// ─── Star helpers ───────────────────────────────────────────────────────────────

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((s) => (
        <FiStar
          key={s}
          size={size}
          className={
            s <= Math.round(rating)
              ? 'fill-[#D4A017] text-[#D4A017]'
              : 'text-gray-300 fill-gray-200'
          }
        />
      ))}
    </div>
  );
}

function InteractiveStar({
  filled,
  hovered,
  onHover,
  onClick,
  index,
}: {
  filled: boolean;
  hovered: boolean;
  onHover: (i: number) => void;
  onClick: (i: number) => void;
  index: number;
}) {
  return (
    <button
      type="button"
      onMouseEnter={() => onHover(index)}
      onClick={() => onClick(index)}
      aria-label={`Rate ${index} star${index > 1 ? 's' : ''}`}
      className="transition-transform hover:scale-110"
    >
      <FiStar
        size={28}
        className={
          filled || hovered
            ? 'fill-[#D4A017] text-[#D4A017]'
            : 'text-gray-300 fill-gray-200'
        }
      />
    </button>
  );
}

// ─── Rating Breakdown Bar ───────────────────────────────────────────────────────

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span className="w-4 text-right">{star}</span>
      <FiStar size={12} className="fill-[#D4A017] text-[#D4A017]" />
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, delay: 0.1 * (5 - star) }}
          className="h-full bg-[#D4A017] rounded-full"
        />
      </div>
      <span className="w-8 text-right text-xs text-gray-400">{count}</span>
    </div>
  );
}

// ─── Skeleton ───────────────────────────────────────────────────────────────────

function ReviewSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 rounded-xl border border-gray-100 space-y-2 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-200 skeleton" />
            <div className="space-y-1 flex-1">
              <div className="h-3 bg-gray-200 rounded skeleton w-24" />
              <div className="h-2.5 bg-gray-200 rounded skeleton w-16" />
            </div>
            <div className="h-3 bg-gray-200 rounded skeleton w-20" />
          </div>
          <div className="h-3 bg-gray-200 rounded skeleton w-full" />
          <div className="h-3 bg-gray-200 rounded skeleton w-3/4" />
        </div>
      ))}
    </div>
  );
}

// ─── ReviewSection ──────────────────────────────────────────────────────────────

export default function ReviewSection({
  productId,
  reviews = [
    {
      id: 'rev-1',
      authorName: 'Nusrat Jahan',
      rating: 5,
      comment: 'Absolutely stunning quality! The handloom texture and motifs are authentic and intricate.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'rev-2',
      authorName: 'Tanvir Chowdhury',
      rating: 5,
      comment: 'Super fast delivery in Dhaka. Great fabric feel and exact color as pictured.',
      createdAt: new Date().toISOString(),
    },
  ],
  averageRating = 4.9,
  reviewCount = 2,
  loading = false,
  onAddReview,
}: ReviewSectionProps) {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  // Form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  // Compute per-star counts from reviews
  const starCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (rating === 0) {
      setFormError('Please select a rating.');
      return;
    }
    if (comment.trim().length < 10) {
      setFormError('Comment must be at least 10 characters.');
      return;
    }
    setSubmitting(true);
    try {
      await onAddReview?.(rating, comment.trim());
      setSubmitted(true);
      setRating(0);
      setComment('');
    } catch {
      setFormError('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-10 space-y-8">
      <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>

      {/* ── Rating Summary ── */}
      <div className="flex flex-col sm:flex-row gap-6 p-5 bg-gray-50 rounded-2xl border border-gray-100">
        {/* Big number */}
        <div className="flex flex-col items-center justify-center min-w-[120px]">
          <span className="text-5xl font-extrabold text-gray-900">
            {averageRating.toFixed(1)}
          </span>
          <Stars rating={averageRating} size={18} />
          <span className="text-sm text-gray-500 mt-1">
            {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
          </span>
        </div>

        {/* Breakdown bars */}
        <div className="flex-1 space-y-1.5 justify-center flex flex-col">
          {starCounts.map(({ star, count }) => (
            <RatingBar key={star} star={star} count={count} total={reviewCount} />
          ))}
        </div>
      </div>

      {/* ── Review List ── */}
      {loading ? (
        <ReviewSkeleton />
      ) : reviews.length === 0 ? (
        <p className="text-gray-500 text-sm py-4 text-center">
          No reviews yet. Be the first to review!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-[#C41E3A]/10 flex items-center justify-center shrink-0">
                  <FiUser size={16} className="text-[#C41E3A]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <span className="font-semibold text-sm text-gray-800">
                      {review.authorName}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(review.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <Stars rating={review.rating} size={12} />
                  <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Add Review Form ── */}
      <div className="border-t border-gray-100 pt-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">Write a Review</h3>

        {!isLoggedIn ? (
          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 border border-gray-200">
            Please{' '}
            <a href="/auth/signin" className="text-[#C41E3A] font-semibold hover:underline">
              sign in
            </a>{' '}
            to leave a review.
          </div>
        ) : submitted ? (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-4 text-sm font-medium"
            >
              ✅ Thank you! Your review has been submitted.
            </motion.div>
          </AnimatePresence>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating <span className="text-red-500">*</span>
              </label>
              <div
                className="flex gap-1"
                onMouseLeave={() => setHoverRating(0)}
              >
                {[1, 2, 3, 4, 5].map((i) => (
                  <InteractiveStar
                    key={i}
                    index={i}
                    filled={i <= rating}
                    hovered={i <= hoverRating}
                    onHover={setHoverRating}
                    onClick={setRating}
                  />
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label
                htmlFor="review-comment"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Review <span className="text-red-500">*</span>
              </label>
              <textarea
                id="review-comment"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product…"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C41E3A]/40 focus:border-[#C41E3A] resize-none transition"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">
                {comment.length} / 500
              </p>
            </div>

            {formError && (
              <p className="text-sm text-red-500 font-medium">{formError}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="bg-[#C41E3A] hover:bg-[#a31830] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
            >
              {submitting ? 'Submitting…' : 'Submit Review'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
