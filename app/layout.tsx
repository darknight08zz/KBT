import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Kaun Banega Texhpati',
  description: 'The Ultimate Technical Quiz Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans antialiased bg-black text-white`} suppressHydrationWarning>{children}</body>
    </html>
  );
}
