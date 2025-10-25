"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Lock, Mail } from "lucide-react"
import Link from "next/link"

function RegisterPage() {
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (registerData.password !== registerData.confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }
    console.log("Register data:", registerData)
    // Aquí iría la lógica de registro
    alert("Registro exitoso")
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-xl">
            <CardHeader className="bg-white-500 text-white">
              <CardTitle className="text-center text-3xl font-bold text-violet-500 mb-4">Crear Cuenta</CardTitle>
              <CardDescription className="text-white/90 text-center text-gray-700">
                Regístrate para participar en nuestro congreso
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleRegisterSubmit} className="space-y-4 md:space-y-6">
                <div className="space-y-1.5">
                  <Label htmlFor="register-name" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-violet-500" />
                    Nombre Completo
                  </Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Tu nombre completo"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="register-email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-violet-500" />
                    Correo Electrónico
                  </Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="ejemplo@dominio.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="register-password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-violet-500" />
                    Contraseña
                  </Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="register-confirm-password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-violet-500" />
                    Confirmar Contraseña
                  </Label>
                  <Input
                    id="register-confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 rounded text-violet-500 focus:ring-violet-500"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    Acepto los{" "}
                    <Link href="#" className="text-violet-600 hover:text-violet-700">
                      términos y condiciones
                    </Link>
                  </label>
                </div>

                <Button type="submit" className="w-full bg-violet-500 hover:bg-violet-600 text-white py-2 h-auto text-base">
                  Crear Cuenta
                </Button>

                <div className="text-center text-sm text-gray-600">
                  ¿Ya tienes una cuenta?{" "}
                  <Link href="/login" className="text-violet-600 hover:text-violet-700 font-medium">
                    Inicia sesión
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
    </div>
  )
}

export default RegisterPage
