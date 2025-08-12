"use client"

import type React from "react"
import { useQueryUsers } from "@/hooks/users/useQueryUsers"
import { useCreateUser } from "@/hooks/users/useCreateUser"
import { useUpdateUser } from "@/hooks/users/useUpdateUser"
import { useDeleteUser } from "@/hooks/users/useDeleteUser"
import { User, CreateUserDto, UpdateUserDto } from "@/entities/User"
import { useState } from "react"
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { Trash2, Edit, Plus, Users, UserCheck, UserX, Search, RotateCcw, X } from "lucide-react"
import { toast } from "sonner"

export default function UsersModule() {
  const { users, isLoading, error, refetch } = useQueryUsers()
  const { createUser, isLoading: isCreating } = useCreateUser()
  const { updateUser, isLoading: isUpdating } = useUpdateUser()
  const { deleteUser, isLoading: isDeleting } = useDeleteUser()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [search, setSearch] = useState('')
  
  // Form states
  const [createForm, setCreateForm] = useState<CreateUserDto>({
    name: "",
    email: "",
    password: "",
    role: "USER",
    dni: ""
  })
  
  const [editForm, setEditForm] = useState<UpdateUserDto>({})

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = await createUser(createForm)
    if (result) {
      toast.success("Usuario creado exitosamente")
      setIsCreateDialogOpen(false)
      setCreateForm({
        name: "",
        email: "",
        password: "",
        role: "USER",
        dni: ""
      })
      refetch()
    } else {
      toast.error("Error al crear usuario")
    }
  }

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedUser) return
    
    const result = await updateUser(selectedUser.id, editForm)
    if (result) {
      toast.success("Usuario actualizado exitosamente")
      setIsEditDialogOpen(false)
      setSelectedUser(null)
      setEditForm({})
      refetch()
    } else {
      toast.error("Error al actualizar usuario")
    }
  }

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`¿Estás seguro de eliminar al usuario ${user.name}?`)) return
    
    const result = await deleteUser(user.id)
    if (result) {
      toast.success("Usuario eliminado exitosamente")
      refetch()
    } else {
      toast.error("Error al eliminar usuario")
    }
  }

  const openEditDialog = (user: User) => {
    setSelectedUser(user)
    setEditForm({
      name: user.name,
      email: user.email,
      givenName: user.givenName,
      familyName: user.familyName,
      role: user.role,
      dni: user.dni
    })
    setIsEditDialogOpen(true)
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'SUPERADMIN': return 'destructive'
      case 'DEVELOPER': return 'default'
      case 'ADMIN': return 'secondary'
      case 'EDITOR': return 'outline'
      default: return 'default'
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        Error al cargar usuarios: {error.message}
      </div>
    )
  }

  // Filter users
  const filteredUsers = users.filter(user => {
    if (user.deletedAt) return false
    if (!search.trim()) return true
    
    const searchLower = search.toLowerCase()
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.dni.includes(search) ||
      user.role.toLowerCase().includes(searchLower)
    )
  })
  
  const activeUsers = filteredUsers
  const deletedUsers = users.filter(user => user.deletedAt)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dni">DNI</Label>
                <Input
                  id="dni"
                  value={createForm.dni}
                  onChange={(e) => setCreateForm({...createForm, dni: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                  required
                  minLength={8}
                />
              </div>
              <div>
                <Label htmlFor="role">Rol</Label>
                <Select value={createForm.role} onValueChange={(value) => setCreateForm({...createForm, role: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">Usuario</SelectItem>
                    <SelectItem value="COLLABORATOR">Colaborador</SelectItem>
                    <SelectItem value="EDITOR">Editor</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                    <SelectItem value="DEVELOPER">Desarrollador</SelectItem>
                    <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={isCreating} className="w-full">
                {isCreating ? <LoadingSpinner /> : "Crear Usuario"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Refresh */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email, DNI o rol..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-10"
              />
              {search && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() => setSearch('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button 
              variant="outline"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Actualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeUsers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Eliminados</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{deletedUsers.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Gestión de usuarios del sistema</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>DNI</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha de Creación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.name}
                    {user.givenName && user.familyName && (
                      <div className="text-sm text-gray-500">
                        {user.givenName} {user.familyName}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.dni}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.emailVerified ? "default" : "secondary"}>
                      {user.emailVerified ? "Verificado" : "Sin verificar"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString('es-ES')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUser(user)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {activeUsers.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              No se encontraron usuarios
            </CardContent>
          </Card>
        ) : (
          activeUsers.map((user) => (
            <Card key={user.id}>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{user.name}</h3>
                      {user.givenName && user.familyName && (
                        <p className="text-sm text-muted-foreground">
                          {user.givenName} {user.familyName}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role}
                      </Badge>
                      <Badge variant={user.emailVerified ? "default" : "secondary"}>
                        {user.emailVerified ? "Verificado" : "Sin verificar"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">DNI</p>
                      <p className="font-medium">{user.dni}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Fecha de Creación</p>
                      <p className="font-medium">
                        {new Date(user.createdAt).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(user)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(user)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditUser} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nombre completo</Label>
              <Input
                id="edit-name"
                value={editForm.name || ""}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email || ""}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-givenName">Nombre de pila</Label>
              <Input
                id="edit-givenName"
                value={editForm.givenName || ""}
                onChange={(e) => setEditForm({...editForm, givenName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-familyName">Apellido</Label>
              <Input
                id="edit-familyName"
                value={editForm.familyName || ""}
                onChange={(e) => setEditForm({...editForm, familyName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-dni">DNI</Label>
              <Input
                id="edit-dni"
                value={editForm.dni || ""}
                onChange={(e) => setEditForm({...editForm, dni: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-role">Rol</Label>
              <Select value={editForm.role} onValueChange={(value) => setEditForm({...editForm, role: value as any})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">Usuario</SelectItem>
                  <SelectItem value="COLLABORATOR">Colaborador</SelectItem>
                  <SelectItem value="EDITOR">Editor</SelectItem>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="DEVELOPER">Desarrollador</SelectItem>
                  <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={isUpdating} className="w-full">
              {isUpdating ? <LoadingSpinner /> : "Actualizar Usuario"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}