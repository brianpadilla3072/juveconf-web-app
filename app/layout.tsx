import './globals.css'
import Head from 'next/head';

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
        <Head>
        
        <link rel="icon" type="image/png" href="/favicon.png" />
        </Head>
        <body  cz-shortcut-listen="true">          
          {children}
        </body>
      </html>
    );
  }
  