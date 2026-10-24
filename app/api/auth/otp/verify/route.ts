import { NextRequest, NextResponse } from 'next/server';
import { verifyOtp, normalizePhone } from '@/lib/otp';

export async function POST(req: NextRequest) {
  try {
    const { phone, code } = await req.json();

    if (!phone || !code) {
      return NextResponse.json(
        { success: false, error: 'Phone number and verification code are required' },
        { status: 400 }
      );
    }

    const clean = normalizePhone(phone);
    const result = verifyOtp(clean, code);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Mobile number verified successfully',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
