// app/api/products/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { rateLimit } from '@/lib/rateLimit';
import Product from '@/models/Product';

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
  const rl = rateLimit(ip, { windowMs: 60_000, max: 60 });
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const q = req.nextUrl.searchParams.get('q')?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  await connectDB();

  const results = await Product.find(
    { $text: { $search: q }, isActive: true },
    { score: { $meta: 'textScore' } },
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(10)
    .select('name slug images price discountPrice rating')
    .lean();

  return NextResponse.json({ results });
}
