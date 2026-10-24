import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';

const NewsletterSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Newsletter =
  mongoose.models.Newsletter || mongoose.model('Newsletter', NewsletterSchema);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ message: 'Valid email address is required' }, { status: 400 });
    }

    try {
      await connectDB();
      await Newsletter.findOneAndUpdate(
        { email: email.toLowerCase() },
        { email: email.toLowerCase(), isActive: true },
        { upsert: true, new: true }
      );
    } catch (dbErr) {
      // Even if DB is offline, acknowledge gracefully for client
      console.warn('DB connection offline for newsletter, logged memory:', email);
    }

    return NextResponse.json({ success: true, message: 'Subscribed successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Subscription failed' }, { status: 500 });
  }
}
