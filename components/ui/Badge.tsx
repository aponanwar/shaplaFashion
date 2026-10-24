// components/ui/Badge.tsx
'use client';
import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'sale' | 'new' | 'featured' | 'out' | 'cod' | 'paid' | 'pending' | 'shipped' | 'delivered' | 'cancelled';
  children: React.ReactNode;
  className?: string;
}

const variants: Record<string, string> = {
  sale: 'bg-primary-600 text-white',
  new: 'bg-emerald-500 text-white',
  featured: 'bg-gold-500 text-white',
  out: 'bg-gray-400 text-white',
  cod: 'bg-orange-100 text-orange-700',
  paid: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export function Badge({ variant = 'new', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        variants[variant] ?? 'bg-gray-100 text-gray-700',
        className
      )}
    >
      {children}
    </span>
  );
}
