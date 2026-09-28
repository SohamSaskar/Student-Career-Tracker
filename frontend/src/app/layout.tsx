import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Newsreader, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/toast/ToastProvider';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  style: ['normal', 'italic'],
  weight: ['400', '500'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DevTrack — Student Career Readiness Platform',
  description:
    'Help students understand where they are, what they should learn next, and what they have already built or achieved.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-dt-page text-dt-primary antialiased min-h-screen flex flex-col selection:bg-dt-navy selection:text-dt-elevated">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
