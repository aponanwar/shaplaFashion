import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage, whatsappChatbotReply } from '@/lib/messaging';

// Webhook verification for Meta WhatsApp Cloud API
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'shapla_secret_webhook_token';

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse('Forbidden', { status: 403 });
}

// Inbound webhook & manual outbound triggers
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if this is a manual send request from internal system
    if (body.to && body.message) {
      const ok = await sendWhatsAppMessage(body.to, body.message);
      return NextResponse.json({ success: ok });
    }

    // Process Meta WhatsApp webhook event (chat replies)
    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const message = value?.messages?.[0];

      if (message && message.type === 'text') {
        const from = message.from; // Sender phone number
        const text = message.text?.body;

        const reply = whatsappChatbotReply(text);
        if (reply) {
          await sendWhatsAppMessage(from, reply);
        }
      }
      return NextResponse.json({ status: 'EVENT_RECEIVED' });
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[WhatsApp Webhook] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
