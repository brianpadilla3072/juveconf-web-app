import AuthRedirect from '@/components/auth/AuthRedirect';
import heroBackground from '@/public/images/hero/hero-background.webp';
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthRedirect>
      <div className="min-h-screen bg-piedra flex items-center justify-center p-4 relative overflow-hidden">
        {/* Fondo con efecto parallax */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${heroBackground.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}  
        />

        {/* Gradiente oscuro */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'linear-gradient(to top, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0.54) 50%, rgba(0, 0, 0, 0.56) 100%)',
            opacity: 0.7,
          }}
        />
        <main className="w-full max-w-md relative z-10">
          {children}
        </main>
      </div>
    </AuthRedirect>
  );
}