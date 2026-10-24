// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: 'Shapla Fashion — Authentic Bangladeshi Clothes & Crafts',
    template: '%s | Shapla Fashion',
  },
  description:
    'Discover authentic Bangladeshi handloom sarees, panjabi, kurtis, and unique homemade crafts. Quality fashion delivered across Bangladesh.',
  keywords: ['bangladeshi clothes', 'handloom saree', 'jamdani', 'homemade crafts', 'online shop bangladesh'],
  authors: [{ name: 'Shapla Fashion' }],
  creator: 'Shapla Fashion',
  openGraph: {
    type: 'website',
    locale: 'en_BD',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Shapla Fashion',
    title: 'Shapla Fashion — Authentic Bangladeshi Clothes & Crafts',
    description: 'Discover authentic Bangladeshi handloom sarees, panjabi, kurtis, and unique homemade crafts.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Shapla Fashion' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shapla Fashion',
    description: 'Authentic Bangladeshi Clothes & Crafts',
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#C41E3A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
