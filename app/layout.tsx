import './globals.css'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';
import { Providers } from './providers';

export const metadata = {
  title: 'JuveConf',
  description: 'Aplicación para la gestión de eventos juveniles, finanzas y administración de la organización Juventud en Conferencia',
  applicationName: 'JuveConf',
  authors: [{ name: 'Juventud en Conferencia' }],
  generator: 'Next.js',
  keywords: ['juveconf', 'juventud', 'conferencia', 'eventos', 'finanzas', 'religioso', 'administración'],
  creator: 'Juventud en Conferencia',
  publisher: 'Juventud en Conferencia',
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
  themeColor: '#8b3fff',
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
    title: 'JuveConf',
  },
  openGraph: {
    type: 'website',
    siteName: 'JuveConf',
    title: 'JuveConf',
    description: 'Aplicación para la gestión de eventos juveniles, finanzas y administración de la organización Juventud en Conferencia',
    images: [
      {
        url: '/icons/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'JuveConf',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'JuveConf',
    description: 'Aplicación para la gestión de eventos juveniles, finanzas y administración',
    images: ['/icons/icon-512x512.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#8b3fff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="JuveConf" />
        <meta name="msapplication-TileColor" content="#8b3fff" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body>
        <Providers>
          <MantineProvider>
            <AuthProvider>
              {children}
              <Toaster richColors position="top-right" />
            </AuthProvider>
          </MantineProvider>
        </Providers>
      </body>
    </html>
  );
}
