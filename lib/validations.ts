// lib/validations.ts — Zod schemas for input validation
import { z } from 'zod';

const bdPhoneRegex = /^(\+880|880|0)1[3-9]\d{8}$/;

// ── Auth ───────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name too short').max(100),
  email: z.string().email('Invalid email'),
  phone: z.string().regex(bdPhoneRegex, 'Invalid BD phone number').optional().or(z.literal('')),
  password: z
    .string()
    .min(8, 'Min 8 characters')
    .regex(/[A-Z]/, 'Needs uppercase')
    .regex(/[0-9]/, 'Needs number'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// ── Product ────────────────────────────────────
export const productSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(10).max(5000),
  shortDescription: z.string().max(300).optional(),
  price: z.number().positive(),
  discountPrice: z.number().positive().optional(),
  category: z.string().min(1, 'Category required'),
  sizes: z.array(z.string()).optional().default([]),
  colors: z.array(z.string()).optional().default([]),
  stock: z.number().int().min(0),
  sku: z.string().min(2).max(50),
  tags: z.array(z.string()).optional().default([]),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isOnSale: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

// ── Order ──────────────────────────────────────
export const shippingAddressSchema = z.object({
  fullName: z.string().min(2).max(100),
  phone: z.string().regex(bdPhoneRegex, 'Invalid BD phone number'),
  addressLine1: z.string().min(5).max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(2).max(100),
  district: z.string().min(2).max(100),
  postalCode: z.string().max(10).optional(),
});

export const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    size: z.string().optional(),
    color: z.string().optional(),
  })).min(1, 'Cart is empty'),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(['cod', 'card', 'bkash', 'nagad']),
  note: z.string().max(500).optional(),
  guestEmail: z.string().email().optional(),
});

export const orderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
  note: z.string().max(200).optional(),
  trackingNumber: z.string().max(100).optional(),
});

// ── Review ─────────────────────────────────────
export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5).max(1000),
});
