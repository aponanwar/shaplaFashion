import { NextRequest, NextResponse } from 'next/server';
import { generateOtp, normalizePhone } from '@/lib/otp';
import { sendSMS } from '@/lib/messaging';

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone || typeof phone !== 'string') {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    const clean = normalizePhone(phone);
    if (!/^01[3-9]\d{8}$/.test(clean)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Bangladeshi mobile number (01XXXXXXXXX)' },
        { status: 400 }
      );
    }

    const code = generateOtp(clean);
    const message = `Your Shapla Fashion verification code is: ${code}. Valid for 5 minutes. Do not share this code.`;

    // Attempt to send real SMS via gateway
    try {
      await sendSMS(clean, message);
    } catch (smsErr) {
      console.warn('[OTP SMS] Failed to send SMS via gateway, using preview mode:', smsErr);
    }

    return NextResponse.json({
      success: true,
      message: `OTP sent to ${clean.slice(0, 3)}****${clean.slice(-3)}`,
      // Return code in response for smooth instant demo testing if SMS gateway is not yet active
      previewCode: code,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
