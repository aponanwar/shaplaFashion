import { NextRequest, NextResponse } from 'next/server';
import { sendSMS, buildOrderSMS } from '@/lib/messaging';

export async function POST(req: NextRequest) {
  try {
    const { to, message, orderId, total } = await req.json();

    if (!to) {
      return NextResponse.json({ error: 'Recipient phone number (to) is required' }, { status: 400 });
    }

    const text = message || (orderId && total ? buildOrderSMS(orderId, total) : 'Shapla Fashion notification');
    const ok = await sendSMS(to, text);

    return NextResponse.json({ success: ok });
  } catch (error: any) {
    console.error('[SMS API] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
