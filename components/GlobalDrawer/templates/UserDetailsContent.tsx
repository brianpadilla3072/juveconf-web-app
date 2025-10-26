'use client';

import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  User as UserIcon,
  Mail,
  FileText,
  Shield,
  Calendar,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Globe
} from 'lucide-react';
import { User } from '@/entities/User';

interface UserDetailsContentProps {
  user: User;
}

export function UserDetailsContent({ user }: UserDetailsContentProps) {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SUPERADMIN':
        return 'bg-red-600 text-white';
      case 'DEVELOPER':
        return 'bg-purple-600 text-white';
      case 'ADMIN':
        return 'bg-blue-600 text-white';
      case 'EDITOR':
        return 'bg-green-600 text-white';
      case 'COLLABORATOR':
        return 'bg-yellow-600 text-white';
      case 'USER':
        return 'bg-gray-600 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      SUPERADMIN: 'Super Administrador',
      DEVELOPER: 'Desarrollador',
      ADMIN: 'Administrador',
      EDITOR: 'Editor',
      COLLABORATOR: 'Colaborador',
      USER: 'Usuario'
    };
    return labels[role] || role;
  };

  return (
    <>
      <SheetHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          {user.picture ? (
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-violet-200">
              <img
                src={user.picture}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="p-2 bg-violet-100 rounded-full">
              <UserIcon className="h-6 w-6 text-violet-600" />
            </div>
          )}
          <div className="flex-1">
            <SheetTitle className="text-2xl font-bold text-violet-900">
              {user.name}
            </SheetTitle>
            <SheetDescription className="text-violet-600">
              {user.email}
            </SheetDescription>
          </div>
        </div>

        {/* Badges de Estado */}
        <div className="flex gap-2 pt-2 flex-wrap">
          <Badge className={`${getRoleBadgeColor(user.role)} text-sm`}>
            {getRoleLabel(user.role)}
          </Badge>
          <Badge variant={user.provider === 'AUTH0' ? 'default' : 'secondary'} className="text-sm">
            {user.provider}
          </Badge>
          {user.emailVerified ? (
            <Badge variant="default" className="text-sm bg-green-600">
              Email Verificado
            </Badge>
          ) : (
            <Badge variant="destructive" className="text-sm">
              Email No Verificado
            </Badge>
          )}
        </div>
      </SheetHeader>

      <Separator className="my-4" />

      <div className="space-y-6">
        {/* Información Personal */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
          <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-violet-600" />
            Información Personal
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <UserIcon className="h-4 w-4 text-slate-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Nombre Completo</p>
                <p className="text-sm text-slate-900 font-medium">
                  {user.name}
                </p>
              </div>
            </div>

            {user.givenName && (
              <div className="flex items-start gap-3">
                <UserIcon className="h-4 w-4 text-slate-500 mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 font-medium">Nombre</p>
                  <p className="text-sm text-slate-900 font-medium">
                    {user.givenName}
                  </p>
                </div>
              </div>
            )}

            {user.familyName && (
              <div className="flex items-start gap-3">
                <UserIcon className="h-4 w-4 text-slate-500 mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 font-medium">Apellido</p>
                  <p className="text-sm text-slate-900 font-medium">
                    {user.familyName}
                  </p>
                </div>
              </div>
            )}

            {user.nickname && (
              <div className="flex items-start gap-3">
                <UserIcon className="h-4 w-4 text-slate-500 mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 font-medium">Apodo</p>
                  <p className="text-sm text-slate-900 font-medium">
                    {user.nickname}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <FileText className="h-4 w-4 text-slate-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">DNI</p>
                <p className="text-sm text-slate-900 font-medium">
                  {user.dni}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Información de Contacto */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
          <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
            <Mail className="h-5 w-5 text-violet-600" />
            Información de Contacto
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-slate-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Email</p>
                <p className="text-sm text-slate-900 font-medium break-all">
                  {user.email}
                </p>
                <div className="mt-1">
                  {user.emailVerified ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      <span className="text-xs">Verificado</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600">
                      <XCircle className="h-3 w-3" />
                      <span className="text-xs">No Verificado</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {user.locale && (
              <div className="flex items-start gap-3">
                <Globe className="h-4 w-4 text-slate-500 mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 font-medium">Idioma</p>
                  <p className="text-sm text-slate-900 font-medium">
                    {user.locale}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Información del Sistema */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
          <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
            <Shield className="h-5 w-5 text-violet-600" />
            Información del Sistema
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Shield className="h-4 w-4 text-slate-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Rol</p>
                <Badge className={`${getRoleBadgeColor(user.role)} mt-1`}>
                  {getRoleLabel(user.role)}
                </Badge>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="h-4 w-4 text-slate-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Proveedor de Autenticación</p>
                <Badge variant={user.provider === 'AUTH0' ? 'default' : 'secondary'} className="mt-1">
                  {user.provider}
                </Badge>
              </div>
            </div>

            {user.auth0Id && (
              <div className="flex items-start gap-3">
                <Shield className="h-4 w-4 text-slate-500 mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 font-medium">Auth0 ID</p>
                  <p className="text-xs text-slate-700 font-mono break-all">
                    {user.auth0Id}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Imagen de Perfil */}
        {user.picture && (
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
            <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-violet-600" />
              Imagen de Perfil
            </h3>
            <div className="flex justify-center">
              <img
                src={user.picture}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-violet-100 object-cover"
              />
            </div>
          </div>
        )}

        {/* Fechas y Actividad */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
          <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-violet-600" />
            Actividad
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-slate-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Fecha de Registro</p>
                <p className="text-sm text-slate-900 font-medium">
                  {new Date(user.createdAt).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-slate-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Última Actualización</p>
                <p className="text-sm text-slate-900 font-medium">
                  {new Date(user.updatedAt).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            {user.lastLogin && (
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-slate-500 mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 font-medium">Último Inicio de Sesión</p>
                  <p className="text-sm text-slate-900 font-medium">
                    {new Date(user.lastLogin).toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* IDs de Referencia */}
        <div className="bg-slate-100/50 rounded-lg p-4 border border-slate-200">
          <h4 className="text-xs font-semibold text-slate-600 mb-2">IDs de Referencia</h4>
          <div className="space-y-2 text-xs font-mono text-slate-500">
            <div>
              <span className="font-bold">User ID:</span> {user.id}
            </div>
            {user.auth0Id && (
              <div>
                <span className="font-bold">Auth0 ID:</span> {user.auth0Id}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
