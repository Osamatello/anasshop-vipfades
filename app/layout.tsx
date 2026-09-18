import './globals.css';
import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

const SITE_URL = 'https://vip-fades.com';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: 'VIP FADES BY ANAS | Barbershop & Barber in Koblenz',

  description:
    'VIP FADES BY ANAS ist dein Barbershop in Koblenz für präzise Herrenhaarschnitte, Skin Fades, Bartpflege und modernes Styling. Termin online buchen.',

  authors: [{ name: 'VIP FADES BY ANAS' }],
  creator: 'VIP FADES BY ANAS',
  publisher: 'VIP FADES BY ANAS',

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  alternates: {
    canonical: SITE_URL,
  },

  icons: {
    icon: '/images/vip-favicon.png',
    shortcut: '/images/vip-favicon.png',
    apple: '/images/vip-favicon.png',
  },

  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: SITE_URL,
    siteName: 'VIP FADES BY ANAS',
    title: 'VIP FADES BY ANAS | Barbershop & Barber in Koblenz',
    description:
      'Barbershop in Koblenz für Herrenhaarschnitte, Skin Fades, Bartpflege und modernes Styling. Buche deinen Termin online.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'VIP FADES BY ANAS — Barbershop in Koblenz',
        type: 'image/png',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'VIP FADES BY ANAS | Barbershop & Barber in Koblenz',
    description:
      'Herrenhaarschnitte, Skin Fades, Bartpflege und modernes Styling bei VIP FADES in Koblenz.',
    images: ['/images/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="de"
      className={`${inter.variable} ${cormorant.variable} scroll-smooth`}
    >
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
