import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import AuthProvider from '@/core/components/common/auth/session-provider';
import { ThemeProvider } from '@/core/providers/theme';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Pulse',
  description: 'Pulse app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} tabular-nums`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
