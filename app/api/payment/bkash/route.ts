// app/api/payment/bkash/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BKASH_BASE_URL = process.env.BKASH_BASE_URL ?? 'https://tokenized.sandbox.bka.sh/v1.2.0-beta';
const BKASH_APP_KEY = process.env.BKASH_APP_KEY ?? '';
const BKASH_APP_SECRET = process.env.BKASH_APP_SECRET ?? '';
const BKASH_USERNAME = process.env.BKASH_USERNAME ?? '';
const BKASH_PASSWORD = process.env.BKASH_PASSWORD ?? '';

async function getBkashToken(): Promise<string> {
  const res = await fetch(`${BKASH_BASE_URL}/tokenized/checkout/token/grant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      username: BKASH_USERNAME,
      password: BKASH_PASSWORD,
    },
    body: JSON.stringify({
      app_key: BKASH_APP_KEY,
      app_secret: BKASH_APP_SECRET,
    }),
  });

  if (!res.ok) {
    throw new Error(`bKash token grant failed: ${res.status}`);
  }

  const data = (await res.json()) as { id_token: string };
  return data.id_token;
}

export async function POST(req: NextRequest) {
  let body: { amount: number; orderId: string; currency?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { amount, orderId, currency = 'BDT' } = body;
  if (!amount || !orderId) {
    return NextResponse.json({ error: 'amount and orderId are required' }, { status: 422 });
  }

  try {
    const token = await getBkashToken();
    const callbackUrl = `${process.env.NEXTAUTH_URL}/api/payment/bkash/callback`;

    const res = await fetch(`${BKASH_BASE_URL}/tokenized/checkout/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: token,
        'X-App-Key': BKASH_APP_KEY,
      },
      body: JSON.stringify({
        mode: '0011',
        payerReference: orderId,
        callbackURL: callbackUrl,
        amount: String(amount),
        currency,
        intent: 'sale',
        merchantInvoiceNumber: orderId,
      }),
    });

    const data = await res.json() as { bkashURL?: string; statusCode?: string; statusMessage?: string };

    if (!res.ok || !data.bkashURL) {
      console.error('[bKash] Create payment failed:', data);
      return NextResponse.json(
        { error: data.statusMessage ?? 'Payment initiation failed' },
        { status: 502 },
      );
    }

    return NextResponse.json({ paymentURL: data.bkashURL });
  } catch (err) {
    console.error('[bKash] Error:', err);
    return NextResponse.json({ error: 'Payment gateway error' }, { status: 500 });
  }
}
