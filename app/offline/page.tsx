'use client'

import { useEffect, useState } from 'react'
import { WifiOff, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    setIsOnline(navigator.onLine)
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  const handleRefresh = () => {
    window.location.reload()
  }

  if (isOnline) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-green-500 mb-4">
            <RefreshCw className="w-16 h-16 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            ¡Conexión restaurada!
          </h1>
          <p className="text-gray-600 mb-6">
            Tu conexión a internet se ha restablecido. Puedes continuar usando la aplicación.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleRefresh}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Actualizar página
            </button>
            <Link 
              href="/app"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Ir al inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-gray-400 mb-4">
          <WifiOff className="w-16 h-16 mx-auto" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Sin conexión a internet
        </h1>
        
        <p className="text-gray-600 mb-6">
          No se pudo conectar a internet. Algunas funciones pueden no estar disponibles.
        </p>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-orange-900 mb-2">
            Funciones disponibles offline:
          </h3>
          <ul className="text-sm text-orange-800 space-y-1">
            <li>• Consultar páginas visitadas recientemente</li>
            <li>• Ver información almacenada en caché</li>
            <li>• Navegar por secciones ya cargadas</li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleRefresh}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Intentar de nuevo
          </button>
          
          <Link 
            href="/app"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Ir al inicio
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Consagrados a Jesús
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Versión offline disponible
          </p>
        </div>
      </div>
    </div>
  )
}