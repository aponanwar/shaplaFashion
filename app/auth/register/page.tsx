'use client';

// app/auth/register/page.tsx
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiEye, FiEyeOff, FiAlertCircle, FiUser, FiMail, FiPhone, FiLock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { isValidBDPhone } from '@/lib/utils';

// ─── Schema ───────────────────────────────────────────────────────────────────

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(60, 'Name is too long'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().refine(isValidBDPhone, {
      message: 'Enter a valid Bangladeshi phone number (e.g. 01XXXXXXXXX)',
    }),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Include at least one uppercase letter')
      .regex(/[0-9]/, 'Include at least one number'),
    confirmPassword: z.string(),
    terms: z.boolean().refine((v) => v === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
      {error && (
        <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
          <FiAlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch('password', '');
  const passwordStrength = (() => {
    let score = 0;
    if (passwordValue.length >= 8) score++;
    if (/[A-Z]/.test(passwordValue)) score++;
    if (/[0-9]/.test(passwordValue)) score++;
    if (/[^A-Za-z0-9]/.test(passwordValue)) score++;
    return score;
  })();

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.toLowerCase().trim(),
          phone: data.phone.trim(),
          password: data.password,
        }),
      });

      const body = await res.json();

      if (!res.ok) {
        toast.error(body.error || 'Registration failed. Please try again.');
        return;
      }

      toast.success('Account created! Welcome to Shapla Fashion 🌸');
      router.push('/');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all outline-none ${
      hasError
        ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200'
        : 'border-gray-200 bg-gray-50 focus:border-[#C41E3A] focus:ring-2 focus:ring-rose-100'
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 flex items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#C41E3A] to-[#a31830] px-8 py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
              <span className="text-3xl">🌸</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Create Account</h1>
            <p className="text-rose-200 text-sm mt-1">Join Shapla Fashion today</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Name */}
              <Field label="Full name" error={errors.name?.message}>
                <div className="relative">
                  <FiUser
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    {...register('name')}
                    type="text"
                    autoComplete="name"
                    placeholder="Fatema Begum"
                    className={inputClass(!!errors.name)}
                  />
                </div>
              </Field>

              {/* Email */}
              <Field label="Email address" error={errors.email?.message}>
                <div className="relative">
                  <FiMail
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    {...register('email')}
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={inputClass(!!errors.email)}
                  />
                </div>
              </Field>

              {/* Phone */}
              <Field label="Phone number" error={errors.phone?.message}>
                <div className="relative">
                  <FiPhone
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    {...register('phone')}
                    type="tel"
                    autoComplete="tel"
                    placeholder="01XXXXXXXXX"
                    className={inputClass(!!errors.phone)}
                  />
                </div>
              </Field>

              {/* Password */}
              <Field label="Password" error={errors.password?.message}>
                <div className="relative">
                  <FiLock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Min. 8 characters"
                    className={`${inputClass(!!errors.password)} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {/* Strength bar */}
                {passwordValue.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          n <= passwordStrength
                            ? passwordStrength <= 1
                              ? 'bg-red-400'
                              : passwordStrength === 2
                              ? 'bg-amber-400'
                              : passwordStrength === 3
                              ? 'bg-yellow-400'
                              : 'bg-green-500'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </Field>

              {/* Confirm password */}
              <Field label="Confirm password" error={errors.confirmPassword?.message}>
                <div className="relative">
                  <FiLock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    {...register('confirmPassword')}
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Re-enter password"
                    className={`${inputClass(!!errors.confirmPassword)} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </Field>

              {/* Terms */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    {...register('terms')}
                    type="checkbox"
                    className="mt-0.5 w-4 h-4 accent-[#C41E3A] rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 leading-relaxed">
                    I agree to the{' '}
                    <Link
                      href="/terms"
                      className="text-[#C41E3A] hover:underline font-medium"
                    >
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                      href="/privacy"
                      className="text-[#C41E3A] hover:underline font-medium"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1 ml-7">
                    <FiAlertCircle size={12} />
                    {errors.terms.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#C41E3A] hover:bg-[#a31830] disabled:bg-gray-300 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Creating account…
                  </>
                ) : (
                  'Create account'
                )}
              </button>
            </form>

            {/* Login link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-[#C41E3A] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} Shapla Fashion. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
