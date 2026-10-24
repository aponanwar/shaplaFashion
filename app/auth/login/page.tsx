'use client';

// app/auth/login/page.tsx
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiEye, FiEyeOff, FiAlertCircle, FiLock, FiMail } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// ─── Schema ───────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ─── Component ────────────────────────────────────────────────────────────────

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    if (isRateLimited) return;

    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: data.email.toLowerCase().trim(),
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        if (
          result.error.includes('Too many') ||
          result.error.includes('locked') ||
          newAttempts >= 5
        ) {
          setIsRateLimited(true);
          toast.error('Too many failed attempts. Please try again later.');
        } else {
          toast.error(result.error || 'Invalid email or password');
        }
      } else {
        toast.success('Welcome back!');
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 flex items-center justify-center p-4">
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
            <h1 className="text-2xl font-bold text-white tracking-tight">Shapla Fashion</h1>
            <p className="text-rose-200 text-sm mt-1">Sign in to your account</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            {/* Rate limit warning */}
            {isRateLimited && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <FiAlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
                <div>
                  <p className="text-sm font-semibold text-red-700">Too many login attempts</p>
                  <p className="text-xs text-red-600 mt-0.5">
                    Your account has been temporarily locked. Please try again in 15 minutes or
                    reset your password.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Login attempt indicator */}
            {loginAttempts > 0 && loginAttempts < 5 && !isRateLimited && (
              <div className="mb-4 flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <FiAlertCircle size={16} className="flex-shrink-0" />
                <p className="text-xs">
                  {5 - loginAttempts} attempt{5 - loginAttempts !== 1 ? 's' : ''} remaining before
                  account lock
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <FiMail
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    size={17}
                  />
                  <input
                    {...register('email')}
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    disabled={isRateLimited}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all outline-none
                      ${errors.email
                        ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200'
                        : 'border-gray-200 bg-gray-50 focus:border-[#C41E3A] focus:ring-2 focus:ring-rose-100'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <FiAlertCircle size={12} />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-[#C41E3A] hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <FiLock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    size={17}
                  />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    disabled={isRateLimited}
                    className={`w-full pl-10 pr-12 py-3 rounded-xl border text-sm transition-all outline-none
                      ${errors.password
                        ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200'
                        : 'border-gray-200 bg-gray-50 focus:border-[#C41E3A] focus:ring-2 focus:ring-rose-100'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <FiAlertCircle size={12} />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || isRateLimited}
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
                    Signing in…
                  </>
                ) : (
                  'Sign in with credentials'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs text-gray-400">
                <span className="bg-white px-3">or</span>
              </div>
            </div>

            {/* Register link */}
            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/register"
                className="text-[#C41E3A] font-semibold hover:underline"
              >
                Create account
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
