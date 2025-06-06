import Navigation from '@/components/navigation';
import { Footer } from '@/components/sections/Footer';
import { FloatingButton } from '@/components/ui/FloatingButton';

export const metadata = {
  title: 'Consagrados a Jesus',
  description: 'Donde la novia se prepara, el cuerpo se edifica, la cabeza Cristo es glorificada, y cada creyente es enviado a echar raíces en su comunidad.',
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
      <FloatingButton />
    </div>
  );
}
  