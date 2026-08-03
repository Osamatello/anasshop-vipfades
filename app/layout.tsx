import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VIP FADES BY ANAS — Premium Barbershop in Koblenz',
  description:
    'Precision barbering, modern style and a premium experience in Koblenz. Book your appointment with Anas or Abd.',
  keywords: 'barbershop, Koblenz, fades, haircut, VIP Fades, Anas, premium barbershop',
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
      <body>{children}</body>
    </html>
  );
}
