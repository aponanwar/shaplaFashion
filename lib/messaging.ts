// lib/messaging.ts — SMS & WhatsApp notification helpers

const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const SMS_API_KEY = process.env.SMS_API_KEY;
const SMS_SENDER_ID = process.env.SMS_SENDER_ID || 'ShaplFash';
const SMS_BASE_URL = process.env.SMS_BASE_URL || 'https://api.sslwireless.com/api/v3';

// ──────────────────────────────────────────────
// WhatsApp (Meta Cloud API)
// ──────────────────────────────────────────────
export async function sendWhatsAppMessage(
  to: string, // international format: +8801XXXXXXXXX
  message: string
): Promise<boolean> {
  if (!WHATSAPP_API_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    console.warn('[WhatsApp] API credentials not set — skipping');
    return false;
  }
  try {
    const res = await fetch(
      `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to.replace(/^0/, '880').replace(/[^0-9+]/g, ''),
          type: 'text',
          text: { preview_url: false, body: message },
        }),
      }
    );
    return res.ok;
  } catch (err) {
    console.error('[WhatsApp] Send failed:', err);
    return false;
  }
}

export function buildOrderConfirmationWA(orderId: string, total: number, name: string): string {
  return (
    `✅ *Shapla Fashion Order Confirmed!*\n\n` +
    `Hi ${name},\n` +
    `Your order *#${orderId}* has been placed successfully.\n\n` +
    `💰 Total: ৳${total.toLocaleString('en-BD')}\n` +
    `🚚 Estimated delivery: 3-5 business days\n\n` +
    `Track your order: ${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderId}\n\n` +
    `Thank you for shopping with Shapla Fashion! 🌸`
  );
}

// ──────────────────────────────────────────────
// SMS (SSL Wireless / generic BD gateway)
// ──────────────────────────────────────────────
export async function sendSMS(to: string, message: string): Promise<boolean> {
  if (!SMS_API_KEY) {
    console.warn('[SMS] API key not set — skipping');
    return false;
  }
  try {
    const phone = to.replace(/^0/, '88').replace(/[^0-9]/g, '');
    const res = await fetch(`${SMS_BASE_URL}/send-sms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_token: SMS_API_KEY,
        sid: SMS_SENDER_ID,
        msisdn: phone,
        sms: message,
        csms_id: `SF-${Date.now()}`,
      }),
    });
    return res.ok;
  } catch (err) {
    console.error('[SMS] Send failed:', err);
    return false;
  }
}

export function buildOrderSMS(orderId: string, total: number): string {
  return `Shapla Fashion: Order #${orderId} confirmed. Total: Tk${total}. Delivery 3-5 days. Track: ${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderId}`;
}

// ──────────────────────────────────────────────
// WhatsApp Chatbot — simple keyword-based
// ──────────────────────────────────────────────
export function whatsappChatbotReply(incomingMessage: string): string | null {
  const msg = incomingMessage.toLowerCase().trim();

  if (msg.includes('order status') || msg.includes('track')) {
    return (
      '🔍 *Track Your Order*\n\n' +
      `Visit: ${process.env.NEXT_PUBLIC_APP_URL}/orders\n` +
      'Or reply with your Order ID (e.g. SF2410XXXXX) to check status.\n\n' +
      'For help, call: ' + process.env.NEXT_PUBLIC_BUSINESS_PHONE
    );
  }
  if (msg.includes('return') || msg.includes('refund')) {
    return (
      '↩️ *Return & Refund Policy*\n\n' +
      'We accept returns within 7 days of delivery for unused items.\n' +
      'Please WhatsApp us at ' + process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER + ' with your order ID and reason.\n\n' +
      'Refunds are processed within 3-5 business days.'
    );
  }
  if (msg.includes('delivery') || msg.includes('shipping')) {
    return (
      '🚚 *Delivery Info*\n\n' +
      '• Dhaka city: 1-2 days (৳60)\n' +
      '• Outside Dhaka: 3-5 days (৳120)\n' +
      '• Free delivery on orders over ৳999 within Dhaka\n\n' +
      'We use Steadfast / Sundarban courier.'
    );
  }
  if (msg.includes('payment') || msg.includes('bkash') || msg.includes('nagad')) {
    return (
      '💳 *Payment Methods*\n\n' +
      '• Cash on Delivery (COD)\n' +
      '• bKash\n' +
      '• Nagad\n' +
      '• Visa / Mastercard\n\n' +
      `Shop now: ${process.env.NEXT_PUBLIC_APP_URL}`
    );
  }
  if (msg === 'hi' || msg === 'hello' || msg === 'হাই' || msg === 'হ্যালো') {
    return (
      `👋 Welcome to *Shapla Fashion*!\n\n` +
      'How can we help you? Reply with:\n' +
      '• *order status* — Track your order\n' +
      '• *delivery* — Shipping info\n' +
      '• *return* — Return policy\n' +
      '• *payment* — Payment methods\n\n' +
      `Shop: ${process.env.NEXT_PUBLIC_APP_URL} 🌸`
    );
  }
  return null; // No auto-reply; human agent takes over
}
