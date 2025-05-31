import Navigation from '@/components/navigation';
import { Footer } from '@/components/sections/Footer';

export const metadata = {
  title: 'Consagrados a Jesus',
  description: 'Descripción del congreso',
  icons: {
    icon: '/favicon.png',
  },
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
}
  