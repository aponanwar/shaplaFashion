// models/Product.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductImage {
  url: string;
  publicId: string;
  alt?: string;
}

export interface IReview {
  user: mongoose.Types.ObjectId;
  name: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  images: IProductImage[];
  price: number;
  discountPrice?: number;
  category: mongoose.Types.ObjectId;
  subcategory?: string;
  tags: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  sku: string;
  reviews: IReview[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isOnSale: boolean;
  isActive: boolean;
  weight?: number;
  dimensions?: { length: number; width: number; height: number };
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, maxlength: 1000 },
  createdAt: { type: Date, default: Date.now },
});

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true, maxlength: 5000 },
    shortDescription: { type: String, maxlength: 300 },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        alt: { type: String },
      },
    ],
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: String },
    tags: [{ type: String, lowercase: true }],
    sizes: [{ type: String }],
    colors: [{ type: String }],
    stock: { type: Number, required: true, default: 0, min: 0 },
    sku: { type: String, required: true, unique: true, uppercase: true },
    reviews: [ReviewSchema],
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isOnSale: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    weight: { type: Number },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
    },
  },
  { timestamps: true }
);

// Indexes for performance
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ rating: -1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ isNewArrival: 1 });
ProductSchema.index({ isOnSale: 1 });
ProductSchema.index({ isActive: 1 });
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
