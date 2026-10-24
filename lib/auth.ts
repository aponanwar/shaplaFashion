// lib/auth.ts — NextAuth configuration
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from './db';
import User from '@/models/User';
import { authRateLimit } from './rateLimit';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        const inputEmail = credentials.email.toLowerCase().trim();
        const inputPassword = credentials.password;

        // ── 1. Direct .env.local Admin Authentication ──
        // Allows site owner to enter admin dashboard immediately with credentials in .env.local
        const envAdminEmail = (process.env.ADMIN_EMAIL || 'admin@shaplaFashion.com').toLowerCase().trim();
        const envAdminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe@123!';

        if (inputEmail === envAdminEmail && inputPassword === envAdminPassword) {
          try {
            await connectDB();
            const existing = await User.findOne({ email: envAdminEmail });
            if (!existing) {
              await User.create({
                name: 'Shapla Admin',
                email: envAdminEmail,
                password: envAdminPassword,
                role: 'superadmin',
                isActive: true,
                isEmailVerified: true,
              });
            }
          } catch (syncErr) {
            console.warn('[Auth] Database cold start sync skipped, granting env admin access:', syncErr);
          }

          return {
            id: 'admin-env-user',
            name: 'Shapla Admin',
            email: envAdminEmail,
            role: 'superadmin',
          };
        }

        // Rate limit by IP for regular users
        const ip =
          (req.headers?.['x-forwarded-for'] as string)?.split(',')[0] ?? '127.0.0.1';
        const rl = authRateLimit(ip);
        if (!rl.success) {
          throw new Error('Too many login attempts. Try again later.');
        }

        await connectDB();

        const user = await User.findOne({
          email: credentials.email.toLowerCase().trim(),
          isActive: true,
        }).select('+password +loginAttempts +lockUntil');

        if (!user) throw new Error('Invalid email or password');

        // Account lock check
        if (user.isLocked()) {
          throw new Error('Account locked. Try again in 15 minutes.');
        }

        const isValid = await user.comparePassword(credentials.password);

        if (!isValid) {
          // Increment login attempts
          user.loginAttempts += 1;
          if (user.loginAttempts >= 5) {
            user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
          }
          await user.save();
          throw new Error('Invalid email or password');
        }

        // Reset attempts on success
        user.loginAttempts = 0;
        user.lockUntil = undefined;
        user.lastLogin = new Date();
        await user.save();

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.avatar,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? 'customer';
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
