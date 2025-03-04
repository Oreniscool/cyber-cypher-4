import type React from 'react';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { LanguageProvider } from '@/context/language-context';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VoiceConnect - Real Estate Communication Assistant',
  description:
    'Multilingual communication assistant for real estate professionals in India',
  generator: 'v0.dev',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <LanguageProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            {children}
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
