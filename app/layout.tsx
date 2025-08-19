import './globals.css'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata = {
  title: 'Consagrados a Jesús',
  description: 'Aplicación para la gestión de eventos religiosos, finanzas y administración de la organización Consagrados a Jesús',
  applicationName: 'Consagrados a Jesús',
  authors: [{ name: 'Consagrados a Jesús' }],
  generator: 'Next.js',
  keywords: ['consagrados', 'jesús', 'eventos', 'finanzas', 'religioso', 'administración'],
  creator: 'Consagrados a Jesús',
  publisher: 'Consagrados a Jesús',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  themeColor: '#ea580c',
  colorScheme: 'light',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    minimumScale: 1,
    viewportFit: 'cover',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Consagrados a Jesús',
  },
  openGraph: {
    type: 'website',
    siteName: 'Consagrados a Jesús',
    title: 'Consagrados a Jesús',
    description: 'Aplicación para la gestión de eventos religiosos, finanzas y administración de la organización Consagrados a Jesús',
    images: [
      {
        url: '/icons/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Consagrados a Jesús',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Consagrados a Jesús',
    description: 'Aplicación para la gestión de eventos religiosos, finanzas y administración',
    images: ['/icons/icon-512x512.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#ea580c" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Consagrados a Jesús" />
        <meta name="msapplication-TileColor" content="#ea580c" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body>
        <MantineProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
