"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

export default function AuthRedirect({
  children,
  requireAuth = false,
  redirectTo = '/login',
  loadingComponent = (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
    </div>
  ),
}: {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
  loadingComponent?: React.ReactNode
}) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    // Si requiere autenticación y no está autenticado, redirigir a login
    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo)
    }
    // Si no requiere autenticación y está autenticado, redirigir a app
    else if (!requireAuth && isAuthenticated) {
      router.push('/app')
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router])

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return <>{loadingComponent}</>
  }

  // Si la ruta requiere autenticación y el usuario no está autenticado, no mostrar contenido
  if (requireAuth && !isAuthenticated) {
    return null
  }

  // Si la ruta es pública y el usuario está autenticado, no mostrar contenido (será redirigido)
  if (!requireAuth && isAuthenticated) {
    return null
  }

  return <>{children}</>
}
