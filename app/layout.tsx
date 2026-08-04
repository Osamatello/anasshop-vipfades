import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VIP FADES BY ANAS — Premium Barbershop in Koblenz',
  description:
    'Precision barbering, modern style and a premium experience in Koblenz. Book your appointment with Anas or Abd.',
  keywords:
    'barbershop, Koblenz, fades, haircut, VIP Fades, Anas, premium barbershop',

  icons: {
    icon: '/images/vip-favicon.png',
    shortcut: '/images/vip-favicon.png',
    apple: '/images/vip-favicon.png',
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