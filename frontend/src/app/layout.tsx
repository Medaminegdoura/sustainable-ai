import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sustainable Negotiation AI',
  description: 'AI-powered sustainable negotiation platform for fair and environmentally responsible agreements',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
