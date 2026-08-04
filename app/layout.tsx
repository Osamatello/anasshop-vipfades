import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VIP FADES BY ANAS — Premium Barbershop in Koblenz',
  description:
    'Precision barbering, modern style and a premium experience in Koblenz. Book your appointment with Anas or Abd.',
  keywords: 'barbershop, Koblenz, fades, haircut, VIP Fades, Anas, premium barbershop',
  icons: {
    icon: [
      { url: '/images/logo_no_background.png', type: 'image/png' },
    ],
    apple: [
      { url: '/images/logo_no_background.png', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'VIP FADES BY ANAS',
    description: 'Premium Cuts. Clean Fades. Koblenz.',
    images: [{ url: '/images/logo_no_background.png' }],
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
        <link rel="icon" href="/images/logo_no_background.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/logo_no_background.png" />
        <link rel="shortcut icon" href="/images/logo_no_background.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
