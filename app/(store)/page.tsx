import HeroBanner from '@/components/home/HeroBanner';
import TrustBadges from '@/components/home/TrustBadges';
import CategoryGrid from '@/components/home/CategoryGrid';
import FlashSale from '@/components/home/FlashSale';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import NewArrivals from '@/components/home/NewArrivals';
import Testimonials from '@/components/home/Testimonials';
import NewsletterBanner from '@/components/home/NewsletterBanner';

export const revalidate = 60; // ISR cache for fast loading & handling high traffic

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroBanner />
      <TrustBadges />
      <CategoryGrid />
      <FlashSale />
      <FeaturedProducts />
      <NewArrivals />
      <Testimonials />
      <NewsletterBanner />
    </div>
  );
}
