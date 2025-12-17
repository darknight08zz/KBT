import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Kaun Banega Texhpati',
  description: 'The Ultimate Technical Quiz Platform',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

import ConsoleLogger from './components/ConsoleLogger';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ConsoleLogger />
        {children}
      </body>
    </html>
  );
}
