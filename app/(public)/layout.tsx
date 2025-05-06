import Navigation from '@/components/navigation';
  export const metadata = {
    title: 'Nombre del Congreso',
    description: 'Descripción del congreso',
  };
  
  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="es">
        <body>
        <Navigation/>
          
          {children}
        </body>
      </html>
    );
  }
  