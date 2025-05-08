"use client"
import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Flame, Mail, Lock } from 'lucide-react'
import Link from "next/link"
import { redirect } from "next/navigation"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const handleLoginSubmit = (e: React.FormEvent) => {
    // Aquí iría la lógica de autenticación
    router.push("/app")
  }

  return (
    <main className="min-h-screen bg-yellow-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-md mx-auto">
          

          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-white-500 text-white">
              <CardTitle className="text-3xl font-bold text-orange-500 mb-4 text-center">Iniciar Sesión</CardTitle>
              <CardDescription className="text-white/90 text-center text-gray-700">
                Ingresa tus datos para acceder a tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-orange-500" />
                    Correo Electrónico
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="ejemplo@dominio.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-orange-500" />
                    Contraseña
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="text-right">
                  <Link href="/reset-password" className="text-sm text-orange-600 hover:text-orange-700">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-500 text-white">
                  Iniciar Sesión
                </Button>

                <div className="text-center text-sm text-gray-600">
                  ¿No tienes una cuenta?{" "}
                  <Link href="/signin" className="text-orange-600 hover:text-orange-700 font-medium">
                    Regístrate aquí
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Flame className="h-5 w-5 text-orange-500" />
              <span>Enciende tu fe con nosotros</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
