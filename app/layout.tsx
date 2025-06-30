import './globals.css'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata = {
  title: 'Consagrados a Jesus',
  description: 'Descripción del congreso',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
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
