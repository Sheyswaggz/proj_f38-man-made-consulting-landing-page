import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Man Made Consulting - Strategic Technology Leadership',
    template: '%s | Man Made Consulting',
  },
  description:
    'Man Made Consulting provides strategic technology leadership and consulting services, helping organizations navigate complex technical challenges and drive innovation.',
  keywords: [
    'technology consulting',
    'strategic leadership',
    'software architecture',
    'digital transformation',
    'technical consulting',
    'engineering leadership',
  ],
  authors: [{ name: 'Man Made Consulting' }],
  creator: 'Man Made Consulting',
  publisher: 'Man Made Consulting',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://manmadeconsulting.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://manmadeconsulting.com',
    siteName: 'Man Made Consulting',
    title: 'Man Made Consulting - Strategic Technology Leadership',
    description:
      'Strategic technology leadership and consulting services for modern organizations.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Man Made Consulting',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Man Made Consulting - Strategic Technology Leadership',
    description:
      'Strategic technology leadership and consulting services for modern organizations.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '',
    yandex: '',
    yahoo: '',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF8F5' },
    { media: '(prefers-color-scheme: dark)', color: '#30231B' },
  ],
  colorScheme: 'light dark',
};

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}