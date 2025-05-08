"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { KeyRound, Mail, Flame } from "lucide-react"

export default function PasswordResetForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [step, setStep] = useState<"email" | "code" | "newPassword">("email")
  const [email, setEmail] = useState<string>("")
  const [resetCode, setResetCode] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")

  async function handleEmailSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    // Aquí iría la lógica para enviar el correo de recuperación
    setTimeout(() => {
      setIsLoading(false)
      setStep("code")
    }, 1500)
  }

  async function handleCodeSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    // Aquí iría la lógica para verificar el código
    setTimeout(() => {
      setIsLoading(false)
      setStep("newPassword")
    }, 1500)
  }

  async function handlePasswordSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    // Aquí iría la lógica para cambiar la contraseña
    setTimeout(() => {
      setIsLoading(false)
      // Redirigir al login o mostrar mensaje de éxito
    }, 1500)
  }

  return (
    <main className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
        {step === "email" && (
          <>
            <h1 className="text-2xl font-bold text-center text-orange-500 mb-2">Recuperar Contraseña</h1>
            <p className="text-center text-gray-600 mb-6">Ingresa tu correo para recibir instrucciones</p>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="flex items-center text-gray-700 mb-2">
                  <Mail className="h-5 w-5 text-orange-500 mr-2" />
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="ejemplo@dominio.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition-colors"
                >
                  {isLoading ? "Enviando..." : "Enviar Instrucciones"}
                </button>
              </div>

              <div className="text-center mt-4">
                <Link href="/login" className="text-orange-500 hover:underline">
                  Volver a Iniciar Sesión
                </Link>
              </div>
            </form>
          </>
        )}

        {step === "code" && (
          <>
            <div className="flex justify-center mb-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <KeyRound className="h-8 w-8 text-orange-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center text-orange-500 mb-2">Verificar Código</h1>
            <p className="text-center text-gray-600 mb-6">
              Hemos enviado un código a <strong>{email}</strong>
            </p>

            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Código de verificación</label>
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  required
                  placeholder="123456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-center tracking-widest"
                  maxLength={6}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition-colors"
                >
                  {isLoading ? "Verificando..." : "Verificar Código"}
                </button>
              </div>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoading(true)
                    setTimeout(() => setIsLoading(false), 1500)
                  }}
                  className="text-orange-500 hover:underline"
                  disabled={isLoading}
                >
                  Reenviar código
                </button>
              </div>
            </form>
          </>
        )}

        {step === "newPassword" && (
          <>
            <div className="flex justify-center mb-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <KeyRound className="h-8 w-8 text-orange-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center text-orange-500 mb-2">Nueva Contraseña</h1>
            <p className="text-center text-gray-600 mb-6">Crea una nueva contraseña para tu cuenta</p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Nueva contraseña</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Confirmar contraseña</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition-colors"
                >
                  {isLoading ? "Actualizando..." : "Actualizar Contraseña"}
                </button>
              </div>

              <div className="text-center mt-4">
                <Link href="/login" className="text-orange-500 hover:underline">
                  Volver a Iniciar Sesión
                </Link>
              </div>
            </form>
          </>
        )}
      </div>

      <div className="mt-8 text-gray-700 flex items-center">
        <Flame className="h-5 w-5 text-orange-500 mr-2" />
        <span>Enciende tu fe con nosotros</span>
      </div>
    </main>
  )
}
