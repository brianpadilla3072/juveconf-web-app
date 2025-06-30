import AuthRedirect from '@/components/auth/AuthRedirect';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthRedirect>
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-4">
        <main className="w-full max-w-md">
          {children}
        </main>
      </div>
    </AuthRedirect>
  );
}