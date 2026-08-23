import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GREBY - Everything You Need, Anywhere You Are',
  description: 'Shop, Sell & Earn with GREBY Marketplace - Properties, Cars, Lands, Machines & Products',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
