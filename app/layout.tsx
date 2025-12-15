import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '@/components/ui/Navigation';

export const metadata: Metadata = {
  title: 'Man Made Consulting - Strategic Business Solutions',
  description:
    'Expert consulting services for modern businesses. We help organizations navigate complex challenges and achieve sustainable growth.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Navigation hideOnScroll={true} />
        {children}
      </body>
    </html>
  );
}