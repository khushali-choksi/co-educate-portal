import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/index.css';
import { AuthProvider } from '../contexts/AuthContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Core Educate - Healthcare Management Portal',
  description: 'Precision in practice management where healing meets organization',
  icons: {
    icon: [
      { url: '/logo.jpeg', type: 'image/jpeg' }
    ],
    apple: [
      { url: '/logo.jpeg', type: 'image/jpeg' }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
