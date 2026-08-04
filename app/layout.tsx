import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VIP FADES BY ANAS — Premium Barbershop in Koblenz',
  description:
    'Precision barbering, modern style and a premium experience in Koblenz. Book your appointment with Anas or Abd.',
  keywords: 'barbershop, Koblenz, fades, haircut, VIP Fades, Anas, premium barbershop',
  icons: {
    icon: [
      { url: '/images/VIP_FADES_LOGO.jpeg', type: 'image/jpeg' },
    ],
    apple: [
      { url: '/images/VIP_FADES_LOGO.jpeg', type: 'image/jpeg' },
    ],
  },
  openGraph: {
    title: 'VIP FADES BY ANAS',
    description: 'Premium Cuts. Clean Fades. Koblenz.',
    images: [{ url: '/images/VIP_FADES_LOGO.jpeg' }],
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
        <link rel="icon" href="/images/VIP_FADES_LOGO.jpeg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/images/VIP_FADES_LOGO.jpeg" />
        <link rel="shortcut icon" href="/images/VIP_FADES_LOGO.jpeg" />
      </head>
      <body>{children}</body>
    </html>
  );
}
