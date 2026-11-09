import HeroBanner from '@/components/home/HeroBanner';
import TrustBadges from '@/components/home/TrustBadges';
import CategoryGrid from '@/components/home/CategoryGrid';
import FlashSale from '@/components/home/FlashSale';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import NewArrivals from '@/components/home/NewArrivals';
import Testimonials from '@/components/home/Testimonials';
import NewsletterBanner from '@/components/home/NewsletterBanner';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';

export const revalidate = 60; // ISR cache for fast loading & handling high traffic

export default async function HomePage() {
  let categoriesData: any[] | undefined = undefined;
  let flashSaleProducts: any[] | undefined = undefined;
  let featuredProducts: any[] | undefined = undefined;
  let newArrivalsProducts: any[] | undefined = undefined;

  try {
    await connectDB();

    // 1. Categories from MongoDB
    const catDocs = await Category.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(6)
      .lean();

    if (catDocs && catDocs.length > 0) {
      categoriesData = catDocs.map((c: any) => ({
        name: c.name,
        slug: c.slug,
        image: c.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
        count: 'Authentic styles',
        emoji: '🌸',
      }));
    }

    // 2. Flash Sale Products from MongoDB
    const flashDocs = await Product.find({ isActive: true, isOnSale: true })
      .sort({ updatedAt: -1 })
      .limit(6)
      .lean();

    if (flashDocs && flashDocs.length > 0) {
      flashSaleProducts = flashDocs.map((p: any) => ({
        _id: String(p._id),
        name: p.name,
        price: p.price,
        salePrice: p.discountPrice || p.price,
        discount: p.discountPrice ? Math.round(((p.price - p.discountPrice) / p.price) * 100) : 20,
        images: (p.images || []).map((img: any) => (typeof img === 'string' ? img : img.url)),
        slug: p.slug,
        stock: p.stock ?? 10,
      }));
    }

    // 3. Featured Products from MongoDB
    const featuredDocs = await Product.find({ isActive: true, isFeatured: true })
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    if (featuredDocs && featuredDocs.length > 0) {
      featuredProducts = featuredDocs.map((p: any) => ({
        _id: String(p._id),
        name: p.name,
        price: p.price,
        salePrice: p.discountPrice,
        images: (p.images || []).map((img: any) => (typeof img === 'string' ? img : img.url)),
        slug: p.slug,
        category: (p.category as any)?.name || 'Fashion',
        rating: p.rating || 4.8,
        reviewCount: p.reviewCount || 10,
      }));
    }

    // 4. New Arrivals from MongoDB
    const newArrivalDocs = await Product.find({ isActive: true, isNewArrival: true })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    if (newArrivalDocs && newArrivalDocs.length > 0) {
      newArrivalsProducts = newArrivalDocs.map((p: any) => ({
        id: String(p._id),
        name: p.name,
        slug: p.slug,
        price: p.price,
        discountPrice: p.discountPrice,
        stock: p.stock ?? 10,
        images: (p.images || []).map((img: any) => (typeof img === 'string' ? img : img.url)),
        rating: p.rating || 4.9,
        reviewCount: p.reviewCount || 12,
        isNewArrival: true,
        sizes: p.sizes,
        colors: p.colors,
      }));
    }
  } catch (error) {
    console.warn('MongoDB HomePage fetch fallback to demo items:', error);
    // If DB fails or is empty, variables remain undefined and components display demo data!
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeroBanner />
      <TrustBadges />
      <CategoryGrid categories={categoriesData} />
      <FlashSale products={flashSaleProducts} />
      <FeaturedProducts products={featuredProducts} />
      <NewArrivals products={newArrivalsProducts} />
      <Testimonials />
      <NewsletterBanner />
    </div>
  );
}
