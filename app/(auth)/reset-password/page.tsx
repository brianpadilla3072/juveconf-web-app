"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Mail, Flame, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function PasswordResetForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [email, setEmail] = useState<string>("")
  const [emailSent, setEmailSent] = useState<boolean>(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email,
      })

      console.log('[Reset Password] Respuesta:', response.data)

      setEmailSent(true)
      toast.success('Si tu email existe, recibirás una contraseña temporal')
    } catch (error: any) {
      console.error('[Reset Password] Error:', error)

      let errorMessage = 'Error al enviar el correo'

      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = 'Email inválido o requerido'
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

  if (emailSent) {
    return (
      <main className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-violet-500 mb-2">
            ¡Correo Enviado!
          </h1>

          <div className="space-y-4 text-gray-700">
            <p className="text-center">
              Si tu email <strong className="text-violet-500">{email}</strong> existe en nuestro sistema, recibirás una contraseña temporal.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="font-medium text-blue-900 mb-2">Próximos pasos:</p>
              <ol className="list-decimal list-inside space-y-1 text-blue-800 text-sm">
                <li>Revisá tu bandeja de entrada</li>
                <li>Copiá la contraseña temporal del correo</li>
                <li>Inicia sesión con tu email y la contraseña temporal</li>
                <li>El sistema te pedirá crear una nueva contraseña</li>
              </ol>
            </div>

            <p className="text-sm text-gray-600 text-center">
              ¿No recibiste el correo? Revisá tu carpeta de spam o intentá nuevamente en unos minutos.
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-violet-500 hover:underline font-medium">
              Volver a Iniciar Sesión
            </Link>
          </div>
        </div>

        <div className="mt-8 text-gray-700 flex items-center">
          <Flame className="h-5 w-5 text-violet-500 mr-2" />
          <span>Enciende tu fe con nosotros</span>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-2xl font-bold text-center text-violet-500 mb-2">
          Recuperar Contraseña
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Ingresa tu correo para recibir una contraseña temporal
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex items-center text-gray-700 mb-2">
              <Mail className="h-5 w-5 text-violet-500 mr-2" />
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ejemplo@dominio.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              disabled={isLoading}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-violet-500 hover:bg-violet-600 text-white py-2 px-4 rounded-md transition-colors disabled:bg-violet-300 disabled:cursor-not-allowed"
            >
              {isLoading ? "Enviando..." : "Enviar Instrucciones"}
            </button>
          </div>

          <div className="text-center mt-4">
            <Link href="/login" className="text-violet-500 hover:underline">
              Volver a Iniciar Sesión
            </Link>
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
