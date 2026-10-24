// components/ui/StarRating.tsx
'use client';
import { FiStar } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

export function StarRating({ rating, reviewCount, size = 'md', showCount = true, className }: StarRatingProps) {
  const sizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };
  const starSizes = { sm: 12, md: 14, lg: 18 };
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = rating >= i + 1;
    const half = !filled && rating >= i + 0.5;
    return { filled, half };
  });

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">
        {stars.map((s, i) =>
          s.filled ? (
            <FaStar key={i} size={starSizes[size]} className="text-gold-500" />
          ) : s.half ? (
            <FaStarHalfAlt key={i} size={starSizes[size]} className="text-gold-500" />
          ) : (
            <FiStar key={i} size={starSizes[size]} className="text-gray-300" />
          )
        )}
      </div>
      {showCount && reviewCount !== undefined && (
        <span className={cn('text-gray-500', sizes[size])}>({reviewCount})</span>
      )}
    </div>
  );
}
