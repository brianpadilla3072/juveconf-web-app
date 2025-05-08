import './globals.css'
  export const metadata = {
    title: 'Nombre del Congreso',
    description: 'Descripción del congreso',
  };
  
  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="es">
        <body  cz-shortcut-listen="true">          
          {children}
        </body>
      </html>
    );
  }
  