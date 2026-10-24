// lib/otp.ts — OTP generation and verification for Cash on Delivery (COD) anti-fraud

interface OtpEntry {
  code: string;
  expiresAt: number;
  attempts: number;
}

// In-memory OTP store (keyed by normalized phone number)
const otpStore = new Map<string, OtpEntry>();

// Clean up expired tokens periodically
setInterval(() => {
  const now = Date.now();
  for (const [phone, entry] of otpStore.entries()) {
    if (entry.expiresAt < now) {
      otpStore.delete(phone);
    }
  }
}, 60_000);

export function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('880')) {
    cleaned = '0' + cleaned.slice(3);
  }
  return cleaned;
}

export function generateOtp(phone: string): string {
  const normalized = normalizePhone(phone);
  // Generate random 4-digit code
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

  otpStore.set(normalized, {
    code,
    expiresAt,
    attempts: 0,
  });

  return code;
}

export function verifyOtp(phone: string, inputCode: string): { success: boolean; message: string } {
  const normalized = normalizePhone(phone);
  const entry = otpStore.get(normalized);

  if (!entry) {
    return { success: false, message: 'OTP expired or not requested. Please request a new code.' };
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(normalized);
    return { success: false, message: 'OTP has expired. Please request a new code.' };
  }

  if (entry.attempts >= 5) {
    otpStore.delete(normalized);
    return { success: false, message: 'Too many incorrect attempts. Please request a new code.' };
  }

  entry.attempts += 1;

  if (entry.code !== inputCode.trim()) {
    return { success: false, message: 'Incorrect OTP code. Please try again.' };
  }

  // Verified successfully: remove OTP to prevent replay
  otpStore.delete(normalized);
  return { success: true, message: 'Phone number verified successfully.' };
}
