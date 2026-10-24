// app/api/products/[slug]/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import connectDB from '@/lib/db';
import { authOptions } from '@/lib/auth';
import Product from '@/models/Product';

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5).max(1000),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  await connectDB();

  const product = await Product.findOne({ slug: params.slug, isActive: true });
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  // Check if user already reviewed
  const alreadyReviewed = product.reviews.some(
    (r) => r.user?.toString() === session.user.id,
  );
  if (alreadyReviewed) {
    return NextResponse.json(
      { error: 'You have already reviewed this product' },
      { status: 409 },
    );
  }

  const { rating, comment } = parsed.data;

  product.reviews.push({
    user: session.user.id as unknown as import('mongoose').Types.ObjectId,
    name: session.user.name ?? 'Anonymous',
    rating,
    comment,
    createdAt: new Date(),
  });

  // Recalculate average rating
  const total = product.reviews.reduce((sum, r) => sum + r.rating, 0);
  product.rating = parseFloat((total / product.reviews.length).toFixed(1));
  product.reviewCount = product.reviews.length;

  await product.save();

  return NextResponse.json(
    { message: 'Review added', rating: product.rating, reviewCount: product.reviewCount },
    { status: 201 },
  );
}
