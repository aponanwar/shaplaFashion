// models/Order.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentMethod = 'cod' | 'card' | 'bkash' | 'nagad';
export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  sku: string;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  postalCode?: string;
}

export interface IOrder extends Document {
  orderId: string;
  user?: mongoose.Types.ObjectId;
  guestEmail?: string;
  guestPhone?: string;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentTransactionId?: string;
  orderStatus: OrderStatus;
  statusHistory: { status: OrderStatus; note?: string; timestamp: Date }[];
  trackingNumber?: string;
  isPhoneVerified?: boolean;
  orderSource?: 'web' | 'whatsapp' | 'manual';
  courier?: {
    provider: 'steadfast' | 'pathao' | 'redx' | 'custom';
    consignmentId?: string;
    trackingCode?: string;
    trackingUrl?: string;
    status?: string;
    shippedAt?: Date;
  };
  note?: string;
  smsSent: boolean;
  whatsappSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  size: { type: String },
  color: { type: String },
  sku: { type: String, required: true },
});

const ShippingAddressSchema = new Schema<IShippingAddress>({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  district: { type: String, required: true },
  postalCode: { type: String },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true, uppercase: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    guestEmail: { type: String },
    guestPhone: { type: String },
    items: [OrderItemSchema],
    shippingAddress: { type: ShippingAddressSchema, required: true },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cod', 'card', 'bkash', 'nagad'], required: true },
    paymentStatus: { type: String, enum: ['unpaid', 'paid', 'failed', 'refunded'], default: 'unpaid' },
    paymentTransactionId: { type: String },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
      default: 'pending',
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        note: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    trackingNumber: { type: String },
    isPhoneVerified: { type: Boolean, default: false },
    orderSource: { type: String, enum: ['web', 'whatsapp', 'manual'], default: 'web' },
    courier: {
      provider: { type: String, enum: ['steadfast', 'pathao', 'redx', 'custom'] },
      consignmentId: { type: String },
      trackingCode: { type: String },
      trackingUrl: { type: String },
      status: { type: String },
      shippedAt: { type: Date },
    },
    note: { type: String, maxlength: 500 },
    smsSent: { type: Boolean, default: false },
    whatsappSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

OrderSchema.index({ user: 1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
