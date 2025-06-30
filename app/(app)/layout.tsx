import AuthRedirect from '@/components/auth/AuthRedirect'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthRedirect requireAuth redirectTo="/login">
      <div className="min-h-screen bg-white">
        {children}
      </div>
    </AuthRedirect>
  )
}
