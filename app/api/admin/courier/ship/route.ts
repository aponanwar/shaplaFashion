import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { createCourierShipment } from '@/lib/courier';
import { sendSMS, sendWhatsAppMessage } from '@/lib/messaging';

export async function POST(req: NextRequest) {
  try {
    const { orderId, provider = 'steadfast', note } = await req.json();

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }

    await connectDB();
    const order = await Order.findOne({ orderId });

    // Customer recipient details
    const recipientName = order?.shippingAddress?.fullName || 'Customer';
    const recipientPhone = order?.shippingAddress?.phone || '01700000000';
    const recipientAddress = `${order?.shippingAddress?.addressLine1 || ''}, ${order?.shippingAddress?.city || ''}, ${order?.shippingAddress?.district || 'Dhaka'}`;
    const codAmount = order?.paymentMethod === 'cod' ? order.total : 0;

    const shipment = await createCourierShipment({
      orderId,
      recipientName,
      recipientPhone,
      recipientAddress,
      codAmount,
      note,
      provider,
    });

    if (order) {
      order.orderStatus = 'shipped';
      order.trackingNumber = shipment.trackingCode;
      order.courier = {
        provider: shipment.provider as any,
        consignmentId: shipment.consignmentId,
        trackingCode: shipment.trackingCode,
        trackingUrl: shipment.trackingUrl,
        status: shipment.status,
        shippedAt: new Date(),
      };
      order.statusHistory.push({
        status: 'shipped',
        note: `Handed over to ${shipment.provider.toUpperCase()} Courier (Tracking: ${shipment.trackingCode})`,
        timestamp: new Date(),
      });
      await order.save();

      // Send SMS and WhatsApp alert with tracking link
      const smsMsg = `Dear ${recipientName}, your Shapla Fashion order #${orderId} is shipped via ${shipment.provider.toUpperCase()}! Tracking code: ${shipment.trackingCode}. Track at: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track-order?id=${orderId}`;
      try {
        await sendSMS(recipientPhone, smsMsg);
        await sendWhatsAppMessage(recipientPhone, smsMsg);
      } catch (msgErr) {
        // Notification failure is non-blocking
      }
    }

    return NextResponse.json({
      success: true,
      shipment,
      message: `Parcel booked with ${shipment.provider.toUpperCase()} Courier`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
