import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VIP FADES BY ANAS | Premium Barbershop in Koblenz',

  description:
    'VIP FADES BY ANAS offers premium haircuts, fades, beard grooming and modern barbering in Koblenz. Book your appointment online with Anas or Abd.',

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

  authors: [
    {
      name: 'VIP FADES BY ANAS',
    },
  ],

  creator: 'VIP FADES BY ANAS',

  publisher: 'VIP FADES BY ANAS',

  robots: {
    index: true,
    follow: true,
  },

  // Uncomment when your final domain is ready
  // metadataBase: new URL('https://your-domain.com'),

  icons: {
    icon: '/images/vip-favicon.png',
    shortcut: '/images/vip-favicon.png',
    apple: '/images/vip-favicon.png',
  },

  openGraph: {
    type: 'website',
    locale: 'en_GB',

    title: 'VIP FADES BY ANAS',

    description:
      'Premium barbering, clean fades and beard grooming in Koblenz.',

    // url: 'https://your-domain.com',

    siteName: 'VIP FADES BY ANAS',

    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VIP FADES BY ANAS',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',

    title: 'VIP FADES BY ANAS',

    description:
      'Premium barbering, clean fades and beard grooming in Koblenz.',

    images: ['/images/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}