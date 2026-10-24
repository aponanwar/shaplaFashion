// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'BDT'): string {
  if (currency === 'BDT') {
    return `৳${amount.toLocaleString('en-BD')}`;
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function generateOrderId(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `SF${year}${month}${day}${random}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function calculateDiscount(price: number, discountPrice: number): number {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '…';
}

export function getImageUrl(url?: string): string {
  if (!url) return '/images/placeholder.jpg';
  return url;
}

// Sanitize user input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function isValidBDPhone(phone: string): boolean {
  return /^(\+880|880|0)1[3-9]\d{8}$/.test(phone.trim());
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export const SHIPPING_FEE = {
  dhaka: 60,
  outside: 120,
};

export const BD_DISTRICTS = [
  'Barisal', 'Bhola', 'Barguna', 'Patuakhali', 'Pirojpur', 'Jhalokati',
  'Chittagong', 'Cox\'s Bazar', 'Rangamati', 'Bandarban', 'Khagrachari', 'Feni', 'Noakhali', 'Lakshmipur', 'Comilla', 'Chandpur', 'Brahmanbaria',
  'Dhaka', 'Gazipur', 'Narayanganj', 'Manikganj', 'Munshiganj', 'Narsingdi', 'Tangail', 'Kishoreganj', 'Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur',
  'Khulna', 'Bagerhat', 'Satkhira', 'Jessore', 'Narail', 'Magura', 'Jhenaidah', 'Kushtia', 'Chuadanga', 'Meherpur',
  'Rajshahi', 'Pabna', 'Natore', 'Sirajganj', 'Bogra', 'Joypurhat', 'Chapai Nawabganj', 'Naogaon',
  'Rangpur', 'Gaibandha', 'Nilphamari', 'Lalmonirhat', 'Kurigram', 'Dinajpur', 'Thakurgaon', 'Panchagarh',
  'Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj',
];
