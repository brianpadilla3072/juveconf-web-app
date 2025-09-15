"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Settings, User, Lock } from "lucide-react"
import ChangePasswordForm from "@/components/auth/ChangePasswordForm"
import { useAuth } from "@/contexts/AuthContext"

export default function SettingsModule() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Configuración</h1>
      </div>
      
      <Separator />
      
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Información del perfil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información del Perfil
            </CardTitle>
            <CardDescription>
              Información básica de tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Nombre</label>
              <p className="text-lg">{user?.name || 'No disponible'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-lg">{user?.email || 'No disponible'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">DNI</label>
              <p className="text-lg">{user?.dni || 'No disponible'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Rol</label>
              <p className="text-lg capitalize">{user?.role?.toLowerCase() || 'No disponible'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Cambio de contraseña */}
        <div>
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  )
}
