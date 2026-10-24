// app/api/products/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } },
) {
  await connectDB();

  const product = await Product.findOne({ slug: params.slug, isActive: true })
    .populate('category', 'name slug description')
    .lean();

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  // Related products: same category, exclude self
  const related = await Product.find({
    category: (product as { category: { _id: unknown } }).category._id,
    _id: { $ne: (product as { _id: unknown })._id },
    isActive: true,
  })
    .limit(8)
    .select('name slug images price discountPrice rating reviewCount')
    .lean();

  return NextResponse.json({ product, related });
}
