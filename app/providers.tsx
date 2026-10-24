'use client';
// app/providers.tsx
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1a1a2e',
            color: '#fff',
            borderRadius: '10px',
            padding: '12px 20px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#D4A017', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#C41E3A', secondary: '#fff' },
          },
        }}
      />
    </SessionProvider>
  );
}
