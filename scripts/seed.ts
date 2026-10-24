import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../lib/db';
import User from '../models/User';
import Category from '../models/Category';
import Product from '../models/Product';

const DEMO_CATEGORIES = [
  // Clothes
  { name: 'Handloom Sarees', slug: 'sarees', description: 'Pure cotton, silk, and Jamdani handloom sarees from Tangail & Dhakai weavers' },
  { name: 'Men’s Panjabi', slug: 'panjabi', description: 'Festive, embroidered, and tailored cotton muslin panjabis' },
  { name: 'Women’s Kurtis', slug: 'kurti', description: 'Hand-block printed casual and semi-formal cotton kurtis' },
  { name: 'Salwar Kameez', slug: 'salwar-kameez', description: 'Three-piece traditional sets with intricate needlework' },
  { name: 'Dresses', slug: 'dresses', description: 'Modern fusion dresses crafted from Bangladeshi handloom fabrics' },
  // Homemade Crafts
  { name: 'Jute Bags & Crafts', slug: 'jute-crafts', description: 'Eco-friendly golden fiber tote bags, plant hangers, and storage baskets' },
  { name: 'Clay Pottery', slug: 'pottery', description: 'Handmade terracotta home decor, vases, and culinary clay pots' },
  { name: 'Nakshi Kantha', slug: 'nakshi-kantha', description: 'Traditional Bengali hand-embroidered quilts, bed runners, and cushion covers' },
  { name: 'Bamboo Crafts', slug: 'bamboo-crafts', description: 'Handcrafted bamboo trays, lampshades, and fruit baskets' },
  { name: 'Wall Art', slug: 'wall-art', description: 'Folk paintings and rickshaw art celebrating Bangladeshi culture' },
];

const DEMO_PRODUCTS = [
  // 1. Handloom Saree
  {
    name: 'Traditional Handloom Cotton Jamdani Saree',
    slug: 'handloom-cotton-jamdani-saree',
    categorySlug: 'sarees',
    description: 'Authentic Tangail woven Jamdani saree made from pure combed cotton with hand-spun metallic zari floral motifs. Ideal for formal gatherings, family festivities, and cultural events.',
    shortDescription: 'Pure handloom cotton with traditional Dhakai floral palla.',
    price: 3200,
    discountPrice: 2499,
    stock: 14,
    sku: 'JAM-COT-001',
    sizes: ['Free Size (12 Haath)'],
    colors: ['Maroon & Gold', 'Black & Silver', 'Royal Blue'],
    tags: ['saree', 'jamdani', 'handloom', 'tangail', 'clothes'],
    isFeatured: true,
    isNewArrival: false,
    isOnSale: true,
    rating: 4.9,
    reviewCount: 38,
    images: [
      { url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80', publicId: 'demo-saree-1' },
      { url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80', publicId: 'demo-saree-2' },
    ],
  },
  // 2. Panjabi
  {
    name: 'Royal Muslin Embroidered Panjabi',
    slug: 'royal-muslin-panjabi',
    categorySlug: 'panjabi',
    description: 'Handcrafted premium muslin cotton panjabi with delicate geometric collar embroidery and mother-of-pearl buttons. Tailored for comfort in warm Bangladeshi climate.',
    shortDescription: 'Embroidered mandarin collar with pure fine-spun muslin.',
    price: 2400,
    discountPrice: 1950,
    stock: 20,
    sku: 'PAN-MUS-002',
    sizes: ['38', '40', '42', '44'],
    colors: ['White', 'Pastel Cream', 'Navy Blue'],
    tags: ['panjabi', 'muslin', 'eid', 'men', 'clothes'],
    isFeatured: true,
    isNewArrival: true,
    isOnSale: true,
    rating: 4.8,
    reviewCount: 29,
    images: [
      { url: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=800&q=80', publicId: 'demo-panjabi-1' },
      { url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&q=80', publicId: 'demo-panjabi-2' },
    ],
  },
  // 3. Jute Craft
  {
    name: 'Handcrafted Eco Jute Tote Bag',
    slug: 'handcrafted-jute-tote-bag',
    categorySlug: 'jute-crafts',
    description: 'Eco-friendly golden fiber tote bag reinforced with vegan leather handles and block-printed cotton lining. Spacious enough for daily groceries or college books.',
    shortDescription: '100% biodegradable Bangladeshi golden jute fiber.',
    price: 650,
    discountPrice: 499,
    stock: 35,
    sku: 'JUT-TOT-003',
    sizes: ['Standard (16" x 14" x 5")'],
    colors: ['Natural Beige', 'Olive Green Accents'],
    tags: ['jute', 'bag', 'tote', 'crafts', 'eco-friendly'],
    isFeatured: true,
    isNewArrival: true,
    isOnSale: true,
    rating: 4.7,
    reviewCount: 42,
    images: [
      { url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80', publicId: 'demo-jute-1' },
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', publicId: 'demo-jute-2' },
    ],
  },
  // 4. Kurti
  {
    name: 'Organic Cotton Block Print Kurti',
    slug: 'organic-cotton-block-print-kurti',
    categorySlug: 'kurti',
    description: 'Pure breathable cotton kurti featuring hand-carved wooden block prints with organic dyes. Comfortable A-line silhouette with three-quarter sleeves.',
    shortDescription: 'Natural vegetable dye block prints on soft cotton.',
    price: 950,
    discountPrice: 799,
    stock: 25,
    sku: 'KUR-BLK-004',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Indigo Blue', 'Maroon Red', 'Earth Brown'],
    tags: ['kurti', 'cotton', 'block-print', 'women', 'clothes'],
    isFeatured: false,
    isNewArrival: true,
    isOnSale: false,
    rating: 4.6,
    reviewCount: 19,
    images: [
      { url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80', publicId: 'demo-kurti-1' },
    ],
  },
  // 5. Wall Art
  {
    name: 'Hand-painted Folk Wall Hanging',
    slug: 'hand-painted-folk-wall-hanging',
    categorySlug: 'wall-art',
    description: 'Colorful folk art canvas banner hand-painted by village artists illustrating Bangladeshi rural life, water lilies (Shapla), and heritage motifs.',
    shortDescription: 'Authentic acrylic folk art canvas ready to hang.',
    price: 1800,
    discountPrice: 1550,
    stock: 3,
    sku: 'CRA-ART-005',
    sizes: ['24" x 18"'],
    colors: ['Multi-color'],
    tags: ['art', 'wall-hanging', 'crafts', 'home-decor', 'folk'],
    isFeatured: false,
    isNewArrival: true,
    isOnSale: true,
    rating: 5.0,
    reviewCount: 11,
    images: [
      { url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&q=80', publicId: 'demo-art-1' },
    ],
  },
  // 6. Pottery
  {
    name: 'Clay Terracotta Vase Set (Pair)',
    slug: 'clay-terracotta-vase-set',
    categorySlug: 'pottery',
    description: 'Wheel-thrown red terracotta vases fired in traditional wood kilns in Rayerbazar pottery cluster. Features etched traditional geometric rings.',
    shortDescription: 'Hand-thrown terracotta clay with natural matte finish.',
    price: 900,
    discountPrice: 750,
    stock: 12,
    sku: 'CRA-POT-006',
    sizes: ['Medium (10" & 8")'],
    colors: ['Natural Terracotta'],
    tags: ['pottery', 'clay', 'vase', 'crafts', 'decor'],
    isFeatured: false,
    isNewArrival: false,
    isOnSale: false,
    rating: 4.7,
    reviewCount: 15,
    images: [
      { url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80', publicId: 'demo-pottery-1' },
    ],
  },
  // 7. Nakshi Kantha
  {
    name: 'Hand-stitched Nakshi Kantha Bedspread',
    slug: 'hand-stitched-nakshi-kantha-bedspread',
    categorySlug: 'nakshi-kantha',
    description: 'Traditional layered cotton Kantha quilt completely hand-stitched by rural women artisans of Jessore. Depicts mythological folklore patterns and paisleys.',
    shortDescription: 'Pure hand-quilted cotton quilt made over 3 weeks.',
    price: 3500,
    discountPrice: 2899,
    stock: 8,
    sku: 'KAN-BED-007',
    sizes: ['Queen (90" x 90")'],
    colors: ['White Base with Red & Yellow Stitching'],
    tags: ['nakshi-kantha', 'quilt', 'handmade', 'crafts'],
    isFeatured: true,
    isNewArrival: false,
    isOnSale: true,
    rating: 4.9,
    reviewCount: 23,
    images: [
      { url: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80', publicId: 'demo-kantha-1' },
    ],
  },
  // 8. Bamboo Basket
  {
    name: 'Handmade Bamboo Fruit & Bread Basket',
    slug: 'handmade-bamboo-fruit-basket',
    categorySlug: 'bamboo-crafts',
    description: 'Woven from mature wild bamboo strips by artisans in Sylhet. Lightweight, splinter-free, and treated naturally for longevity.',
    shortDescription: 'Sturdy wild bamboo woven basket for dining and kitchen.',
    price: 450,
    discountPrice: 380,
    stock: 22,
    sku: 'BAM-BSK-008',
    sizes: ['Diameter 12"'],
    colors: ['Natural Bamboo'],
    tags: ['bamboo', 'basket', 'kitchen', 'crafts'],
    isFeatured: false,
    isNewArrival: true,
    isOnSale: false,
    rating: 4.8,
    reviewCount: 16,
    images: [
      { url: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=800&q=80', publicId: 'demo-bamboo-1' },
    ],
  },
];

async function seed() {
  console.log('🌸 Starting Shapla Fashion database seeding...');

  try {
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // 1. Seed Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@shaplaFashion.com';
    const adminPass = process.env.ADMIN_PASSWORD || 'ChangeMe@123!';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: 'Shapla Admin',
        email: adminEmail,
        password: adminPass, // pre-save hook will hash with bcrypt
        role: 'superadmin',
        isActive: true,
        isEmailVerified: true,
      });
      console.log(`✅ Admin created: ${adminEmail} / ${adminPass}`);
    } else {
      console.log(`ℹ️ Admin already exists: ${adminEmail}`);
    }

    // 2. Seed Categories
    const categoryMap = new Map<string, any>();
    for (const cat of DEMO_CATEGORIES) {
      const doc = await Category.findOneAndUpdate(
        { slug: cat.slug },
        { ...cat, isActive: true },
        { upsert: true, new: true }
      );
      categoryMap.set(cat.slug, doc._id);
    }
    console.log(`✅ Seeded ${DEMO_CATEGORIES.length} categories`);

    // 3. Seed Products
    let count = 0;
    for (const p of DEMO_PRODUCTS) {
      const categoryId = categoryMap.get(p.categorySlug);
      if (!categoryId) continue;

      const { categorySlug, ...rest } = p;
      await Product.findOneAndUpdate(
        { slug: p.slug },
        { ...rest, category: categoryId, isActive: true },
        { upsert: true, new: true }
      );
      count++;
    }
    console.log(`✅ Seeded ${count} demo clothes & crafts products`);

    console.log('🎉 Shapla Fashion database successfully initialized!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();
