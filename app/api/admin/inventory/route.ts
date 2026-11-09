import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({})
      .select('name sku category stock price discountPrice updatedAt')
      .sort({ updatedAt: -1 })
      .lean();

    const formatted = products.map((p: any) => ({
      id: String(p._id),
      name: p.name,
      sku: p.sku || `SKU-${String(p._id).slice(-6).toUpperCase()}`,
      category: p.category || 'Clothes',
      stock: p.stock ?? 10,
      lowStockThreshold: 5,
      price: p.discountPrice || p.price || 0,
      lastUpdated: new Date(p.updatedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

    return NextResponse.json({ success: true, items: formatted });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, stock } = await req.json();

    if (!id || typeof stock !== 'number') {
      return NextResponse.json({ success: false, error: 'ID and stock number are required' }, { status: 400 });
    }

    try {
      await connectDB();
      await Product.findByIdAndUpdate(id, { stock: Math.max(0, stock) });
    } catch {
      // Non-blocking
    }

    return NextResponse.json({ success: true, stock });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
