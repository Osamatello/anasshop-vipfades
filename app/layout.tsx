import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VIP FADES BY ANAS — Premium Barbershop in Koblenz',
  description:
    'Precision barbering, modern style and a premium experience in Koblenz. Book your appointment with Anas or Abd.',
  keywords: 'barbershop, Koblenz, fades, haircut, VIP Fades, Anas, premium barbershop',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', type: 'image/png', sizes: '180x180' },
    ],
  },
  openGraph: {
    title: 'VIP FADES BY ANAS',
    description: 'Premium Cuts. Clean Fades. Koblenz.',
    images: [{ url: '/images/vip-fades-logo.png' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
