"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { KeyRound, Lock, Eye, EyeOff, Flame } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function ChangePasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false)
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    // Validación básica
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    if (formData.newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setIsLoading(true)

    try {
      // Obtener token del localStorage
      const token = localStorage.getItem('token')

      if (!token) {
        toast.error('No estás autenticado. Por favor, inicia sesión.')
        router.push('/login')
        return
      }

      const response = await axios.patch(
        `${API_URL}/auth/profile/password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      console.log('[Change Password] Respuesta:', response.data)

      toast.success('Contraseña actualizada exitosamente')

      // Redirigir al dashboard después de cambiar la contraseña
      setTimeout(() => {
        router.push('/app')
      }, 1000)
    } catch (error: any) {
      console.error('[Change Password] Error:', error)

      let errorMessage = 'Error al cambiar la contraseña'

      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = error.response.data?.message || 'Datos inválidos'
            break
          case 401:
            errorMessage = 'La contraseña actual es incorrecta'
            break
          case 500:
            errorMessage = 'Error del servidor. Inténtalo más tarde'
            break
          default:
            errorMessage = error.response.data?.message ||
                         `Error ${error.response.status}: ${error.response.statusText}`
        }
      } else if (error.request) {
        errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión'
      } else if (error.message) {
        errorMessage = error.message
      }

      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
        <div className="flex justify-center mb-4">
          <div className="bg-violet-100 p-3 rounded-full">
            <KeyRound className="h-8 w-8 text-violet-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-violet-500 mb-2">
          Cambiar Contraseña
        </h1>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 mb-6 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Atención:</strong> Estás usando una contraseña temporal. Debes crear una nueva contraseña para continuar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contraseña Actual (temporal) */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Contraseña Temporal
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                required
                placeholder="Ingresa la contraseña temporal del correo"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Nueva Contraseña */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Nueva Contraseña
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                required
                placeholder="Crea una nueva contraseña segura"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Confirmar Nueva Contraseña */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Confirmar Nueva Contraseña
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                placeholder="Confirma tu nueva contraseña"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-violet-500 hover:bg-violet-600 text-white py-2 px-4 rounded-md transition-colors disabled:bg-violet-300 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? "Actualizando..." : "Actualizar Contraseña"}
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4">
            <p className="text-xs text-blue-800">
              <Lock className="inline h-4 w-4 mr-1" />
              <strong>Consejo:</strong> Usa una contraseña segura con al menos 6 caracteres, combinando letras, números y símbolos.
            </p>
          </div>
        </form>
      </div>

      <div className="mt-8 text-gray-700 flex items-center">
        <Flame className="h-5 w-5 text-violet-500 mr-2" />
        <span>Enciende tu fe con nosotros</span>
      </div>
    </main>
  )
}
