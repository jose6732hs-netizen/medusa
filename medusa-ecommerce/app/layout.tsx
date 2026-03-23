import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { NavBar } from '@/components/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Medusa ECommerce - Plataforma Multi-Tenant',
  description:
    'Uma plataforma de ecommerce moderna multi-tenant similar ao Medusa',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
