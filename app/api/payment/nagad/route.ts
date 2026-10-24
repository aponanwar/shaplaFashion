import { NextRequest, NextResponse } from 'next/server';

const NAGAD_MERCHANT_ID = process.env.NAGAD_MERCHANT_ID || '';
const NAGAD_BASE_URL = process.env.NAGAD_BASE_URL || 'https://sandbox.mynagad.com:10080/remote-payment-gateway-1.0';

export async function POST(req: NextRequest) {
  try {
    const { amount, orderId } = await req.json();

    if (!amount || !orderId) {
      return NextResponse.json({ error: 'amount and orderId are required' }, { status: 400 });
    }

    // In sandbox or when keys are placeholders, provide a seamless mock/tokenized callback
    if (!NAGAD_MERCHANT_ID || NAGAD_MERCHANT_ID.includes('your_')) {
      return NextResponse.json({
        success: true,
        paymentUrl: `/orders/${orderId}?payment=mock_nagad`,
        message: 'Nagad sandbox initialized',
      });
    }

    // Initialize Nagad payment request
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/nagad/callback`;
    const response = await fetch(`${NAGAD_BASE_URL}/api/dfs/check-out/initialize/${NAGAD_MERCHANT_ID}/${orderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-KM-Api-Version': 'v-0.2.0',
        'X-KM-IP-Add': '127.0.0.1',
      },
      body: JSON.stringify({
        accountNumber: NAGAD_MERCHANT_ID,
        dateTime: new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14),
        sensitiveData: 'encrypted_data',
        signature: 'signature',
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Nagad] Payment error:', error);
    return NextResponse.json({ error: error.message || 'Payment initiation failed' }, { status: 500 });
  }
}
