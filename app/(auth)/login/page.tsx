"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { Logo } from "../../components/Logo/Logo"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await login(loginData.email, loginData.password)
      toast.success('Inicio de sesión exitoso')
      router.push('/app')
    } catch (error: any) {
      console.error('Error en el inicio de sesión:', error)
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Error al iniciar sesión'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
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
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {/* <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember-me" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(!!checked)}
                    />
                    <label
                      htmlFor="remember-me"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Recordar usuario
                    </label>
                  </div> */}
                  <Link href="/reset-password" className="text-sm text-orange-600 hover:text-orange-700">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-orange-500 hover:bg-orange-500 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
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
              <Logo size={20} />
              <span>Enciende tu fe con nosotros</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
