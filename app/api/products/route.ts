// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import connectDB from '@/lib/db';
import { rateLimit } from '@/lib/rateLimit';
import { authOptions } from '@/lib/auth';
import Product from '@/models/Product';
import slugify from 'slugify';

// ─── Zod Schema ──────────────────────────────────────────────────────────────
const createProductSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(10).max(5000),
  shortDescription: z.string().max(300).optional(),
  price: z.number().positive(),
  discountPrice: z.number().positive().optional(),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  sizes: z.array(z.string()).optional().default([]),
  colors: z.array(z.string()).optional().default([]),
  stock: z.number().int().min(0),
  sku: z.string().min(1),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        publicId: z.string(),
        alt: z.string().optional(),
      }),
    )
    .min(1),
  isFeatured: z.boolean().optional().default(false),
  isNewArrival: z.boolean().optional().default(false),
  isOnSale: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  weight: z.number().optional(),
  dimensions: z
    .object({ length: z.number(), width: z.number(), height: z.number() })
    .optional(),
});

// ─── GET /api/products ────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
  const rl = rateLimit(ip);
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) },
      },
    );
  }

  await connectDB();

  const { searchParams } = req.nextUrl;

  // Pagination
  const page = Math.max(1, Number(searchParams.get('page') ?? 1));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? 20)));
  const skip = (page - 1) * limit;

  // Build query filter
  const filter: Record<string, unknown> = { isActive: true };

  const category = searchParams.get('category');
  if (category) filter.category = category;

  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) (filter.price as Record<string, number>).$gte = Number(minPrice);
    if (maxPrice) (filter.price as Record<string, number>).$lte = Number(maxPrice);
  }

  const sizes = searchParams.get('sizes');
  if (sizes) filter.sizes = { $in: sizes.split(',').map((s) => s.trim()) };

  const colors = searchParams.get('colors');
  if (colors) filter.colors = { $in: colors.split(',').map((c) => c.trim()) };

  if (searchParams.get('featured') === 'true') filter.isFeatured = true;
  if (searchParams.get('newArrival') === 'true') filter.isNewArrival = true;
  if (searchParams.get('onSale') === 'true') filter.isOnSale = true;

  const search = searchParams.get('search');
  if (search) filter.$text = { $search: search };

  // Sorting
  const sortParam = searchParams.get('sort') ?? 'newest';
  const sortMap: Record<string, Record<string, number>> = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    rating: { rating: -1 },
  };
  const sort = sortMap[sortParam] ?? { createdAt: -1 };

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort as any)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return NextResponse.json({
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  });
}

// ─── POST /api/products ───────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !['admin', 'superadmin'].includes(session.user.role ?? '')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
  const rl = rateLimit(ip, { max: 30 });
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = createProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  await connectDB();

  const data = parsed.data;
  const slug = slugify(data.name, { lower: true, strict: true });

  // Ensure unique slug
  const existing = await Product.findOne({ slug });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  const product = await Product.create({ ...data, slug: finalSlug });

  return NextResponse.json({ product }, { status: 201 });
}
