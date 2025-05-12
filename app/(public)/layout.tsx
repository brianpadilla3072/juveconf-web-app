import Navigation from '@/components/navigation';
  export const metadata = {
    title: 'Consagrados a Jesus',
    description: 'Descripción del congreso',
     icons: {
    icon: '/favicon.png',
  },
  };
  
  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <>
        <Navigation/>
          
          {children}
      </>
        
    );
  }
  