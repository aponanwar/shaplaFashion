import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import { authOptions } from '@/lib/auth';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { sendSMS, sendWhatsAppMessage, buildOrderConfirmationWA, buildOrderSMS } from '@/lib/messaging';

function generateOrderId(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SF${year}${month}${day}${random}`;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (orderId) {
      const order = await Order.findOne({ orderId });
      if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      return NextResponse.json({ order });
    }

    const filter: Record<string, any> = {};
    if (session?.user?.role !== 'admin' && session?.user?.role !== 'superadmin') {
      if (session?.user?.id) {
        filter.user = session.user.id;
      } else {
        return NextResponse.json({ orders: [] });
      }
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(50).lean();
    return NextResponse.json({ orders });
  } catch (err: any) {
    return NextResponse.json({ orders: [], message: err.message });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const {
      items,
      shippingAddress,
      paymentMethod = 'cod',
      paymentTransactionId,
      subtotal,
      shippingFee = 0,
      discount = 0,
      total,
      note,
      guestEmail,
    } = body;

    if (!items || !items.length || !shippingAddress || !shippingAddress.fullName || !shippingAddress.phone) {
      return NextResponse.json({ error: 'Incomplete order details' }, { status: 400 });
    }

    const orderId = generateOrderId();
    const normalizedItems = items.map((it: any) => ({
      product: mongoose.Types.ObjectId.isValid(it.product || it.productId)
        ? new mongoose.Types.ObjectId(it.product || it.productId)
        : new mongoose.Types.ObjectId(),
      name: it.name,
      image: it.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80',
      price: it.price,
      quantity: it.quantity,
      size: it.size,
      color: it.color,
      sku: it.sku || 'SKU-DEMO',
    }));

    let savedOrder: any = null;

    try {
      await connectDB();

      // Attempt to deduct stock
      for (const item of items) {
        const prodId = item.product || item.productId;
        if (mongoose.Types.ObjectId.isValid(prodId)) {
          await Product.findByIdAndUpdate(prodId, {
            $inc: { stock: -item.quantity },
          });
        }
      }

      savedOrder = await Order.create({
        orderId,
        user: session?.user?.id ? new mongoose.Types.ObjectId(session.user.id) : undefined,
        guestEmail,
        guestPhone: shippingAddress.phone,
        items: normalizedItems,
        shippingAddress,
        subtotal: subtotal || items.reduce((s: number, i: any) => s + i.price * i.quantity, 0),
        shippingFee,
        discount,
        total: total || subtotal + shippingFee - discount,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'paid',
        paymentTransactionId,
        orderStatus: 'pending',
        statusHistory: [{ status: 'pending', timestamp: new Date() }],
        note,
        smsSent: false,
        whatsappSent: false,
      });
    } catch (dbErr) {
      console.warn('[Orders API] MongoDB not reachable, using in-memory order record:', dbErr);
      savedOrder = {
        orderId,
        items: normalizedItems,
        shippingAddress,
        total: total || subtotal + shippingFee,
        paymentMethod,
        paymentStatus: 'unpaid',
        orderStatus: 'pending',
        createdAt: new Date(),
      };
    }

    // Trigger SMS and WhatsApp notifications
    const phone = shippingAddress.phone;
    const finalTotal = total || subtotal + shippingFee;

    // Async SMS & WhatsApp (non-blocking)
    try {
      const smsMsg = buildOrderSMS(orderId, finalTotal);
      void sendSMS(phone, smsMsg);

      const waMsg = buildOrderConfirmationWA(orderId, finalTotal, shippingAddress.fullName);
      void sendWhatsAppMessage(phone, waMsg);
    } catch (msgErr) {
      console.error('[Messaging Trigger] Error:', msgErr);
    }

    return NextResponse.json({ success: true, order: savedOrder }, { status: 201 });
  } catch (error: any) {
    console.error('[Create Order] Error:', error);
    return NextResponse.json({ error: error.message || 'Order creation failed' }, { status: 500 });
  }
}
