import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Betr - Free $10 Sports Betting',
  description: 'Get your free $10 today and start winning on Betr. No deposit required.',
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
