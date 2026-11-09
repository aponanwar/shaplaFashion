// app/api/categories/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';

const DEMO_CATEGORIES = [
  { _id: '1', name: 'Sarees', slug: 'sarees', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80', description: 'Traditional Jamdani, Silk & Cotton Sarees', count: '120+ styles' },
  { _id: '2', name: 'Panjabi', slug: 'panjabi', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80', description: 'Men handcrafted & festive Panjabi', count: '80+ styles' },
  { _id: '3', name: 'Kurti', slug: 'kurti', image: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=600&q=80', description: 'Trendy and comfortable daily wear kurtis', count: '95+ styles' },
  { _id: '4', name: 'Salwar Kameez', slug: 'salwar-kameez', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80', description: 'Elegant two-piece and three-piece sets', count: '70+ styles' },
  { _id: '5', name: 'Jute Crafts', slug: 'jute-crafts', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', description: 'Eco-friendly jute bags and home decor', count: '45+ items' },
  { _id: '6', name: 'Wall Art', slug: 'wall-art', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80', description: 'Nakshi Kantha and handmade paintings', count: '60+ pieces' },
];

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    if (categories && categories.length > 0) {
      return NextResponse.json({ categories });
    }
  } catch (error) {
    console.warn('MongoDB category fetch failed, falling back to demo categories:', error);
  }

  // Graceful fallback to demo categories
  return NextResponse.json({ categories: DEMO_CATEGORIES });
}
