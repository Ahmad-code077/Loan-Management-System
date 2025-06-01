import { Inter } from 'next/font/google';
import './globals.css';
import ClientProvider from '@/components/provider/ClientProvider';
import AuthGuard from '@/components/AuthGard';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'DR Loan',
  description: 'DR Loan Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`${inter.className}`}>
        <ClientProvider>
          <AuthGuard>{children}</AuthGuard>
        </ClientProvider>
      </body>
    </html>
  );
}
