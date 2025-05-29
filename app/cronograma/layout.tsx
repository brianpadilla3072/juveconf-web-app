import Navigation from '@/components/navigation';

export default function CronogramaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
