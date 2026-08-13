import './globals.css';
import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const SITE_URL = 'https://vip-fades.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: 'VIP FADES BY ANAS | Premium Barbershop in Koblenz',

  description:
    'VIP FADES BY ANAS offers premium haircuts, clean fades, beard grooming and modern barbering in Koblenz. Book your appointment online with Anas or Abd.',

  keywords: [
    'VIP FADES',
    'VIP FADES Koblenz',
    'Barbershop Koblenz',
    'Barber Koblenz',
    'Haircut Koblenz',
    'Fade Koblenz',
    'Mens Haircut Koblenz',
    'Beard Trim Koblenz',
    'Anas Barber',
    'Premium Barbershop',
  ],

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
    title: 'VIP FADES BY ANAS | Premium Barbershop in Koblenz',
    description:
      'Premium cuts, clean fades and beard grooming in Koblenz. Book your appointment online with Anas or Abd.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'VIP FADES BY ANAS — Premium Cuts. Clean Fades.',
        type: 'image/png',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'VIP FADES BY ANAS | Premium Barbershop in Koblenz',
    description:
      'Premium cuts, clean fades and beard grooming in Koblenz.',
    images: ['/images/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}