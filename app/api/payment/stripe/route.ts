import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const stripe = stripeSecret && !stripeSecret.includes('your_') ? new Stripe(stripeSecret) : null;

export async function POST(req: NextRequest) {
  try {
    const { amount, orderId } = await req.json();

    if (!amount || !orderId) {
      return NextResponse.json({ error: 'amount and orderId are required' }, { status: 400 });
    }

    if (!stripe) {
      // Return simulated clientSecret if testing with placeholders
      return NextResponse.json({
        clientSecret: `pi_test_mock_${orderId}_secret_${Date.now()}`,
        message: 'Stripe configured in test mock mode',
      });
    }

    // Amount in cents / poisha (e.g. 1 BDT = 100 poisha or USD cents)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'bdt',
      metadata: { orderId },
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error('[Stripe] Error:', error);
    return NextResponse.json({ error: error.message || 'Payment intent failed' }, { status: 500 });
  }
}
