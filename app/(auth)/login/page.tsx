"use client"

import React, { useState } from "react"
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
import heroBackground from '../../../public/images/hero/hero-background.webp';

function LoginPage() {
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
    console.log('🟢 [LoginPage] handleLoginSubmit ejecutado');
    console.log('🟢 [LoginPage] Datos:', { email: loginData.email, password: '***' });

    e.preventDefault()
    console.log('🟢 [LoginPage] preventDefault ejecutado');

    setIsLoading(true)

    try {
      console.log('🟢 [LoginPage] Llamando a login()...');
      await login(loginData.email, loginData.password)
      toast.success('Inicio de sesión exitoso')
      // No necesitamos router.push aquí porque AuthContext ya lo hace
    } catch (error: any) {
      console.error('Error en el inicio de sesión:', error)
      
      let errorMessage = 'Error al iniciar sesión';
      
      if (error.response) {
        // Error del servidor con respuesta
        switch (error.response.status) {
          case 400:
            errorMessage = 'Datos de inicio de sesión inválidos';
            break;
          case 401:
            errorMessage = 'Email o contraseña incorrectos';
            break;
          case 403:
            errorMessage = 'Acceso denegado';
            break;
          case 500:
            errorMessage = 'Error del servidor. Inténtalo más tarde';
            break;
          default:
            errorMessage = error.response.data?.message || 
                         `Error ${error.response.status}: ${error.response.statusText}`;
        }
      } else if (error.request) {
        // Error de red
        errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión a internet';
      } else if (error.message) {
        // Error específico
        errorMessage = error.message;
      }
      
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-white-500 text-white">
            <CardTitle className="text-3xl font-bold text-violet-500 mb-4 text-center">Iniciar Sesión</CardTitle>
            <CardDescription className="text-white/90 text-center text-gray-700">
              Ingresa tus datos para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={(e) => {
              console.log('🔴 [FORM] onSubmit EJECUTADO - preventDefault AHORA');
              e.preventDefault();
              e.stopPropagation();
              handleLoginSubmit(e);
            }} className="space-y-4 md:space-y-6">
              <div className="space-y-1.5">
                <Label htmlFor="login-email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-violet-500" />
                  Correo Electrónico
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="ejemplo@dominio.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                  className="text-base py-2 h-auto"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="login-password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-violet-500" />
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
                  <Link href="/reset-password" className="text-sm text-violet-600 hover:text-violet-700">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-violet-500 hover:bg-violet-600 text-white py-2 h-auto text-base"
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
                  <Link href="/signin" className="text-violet-600 hover:text-violet-700 font-medium">
                    Regístrate aquí
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
   
  )
}

export default LoginPage
