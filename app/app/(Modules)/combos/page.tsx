"use client"

import type React from "react"
import { useQueryCombos } from "@/hooks/combos/useQueryCombos"
import { useCreateCombo } from "@/hooks/combos/useCreateCombo"
import { useUpdateCombo } from "@/hooks/combos/useUpdateCombo"
import { useDeleteCombo } from "@/hooks/combos/useDeleteCombo"
import { Combo, CreateComboDto, UpdateComboDto } from "@/entities/Combo"
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
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { Trash2, Edit, Plus, Package, DollarSign, Users, Search, RotateCcw, X } from "lucide-react"
import { toast } from "sonner"

export default function CombosModule() {
  const { combos, isLoading, error, refetch } = useQueryCombos()
  const { createCombo, isLoading: isCreating } = useCreateCombo()
  const { updateCombo, isLoading: isUpdating } = useUpdateCombo()
  const { deleteCombo, isLoading: isDeleting } = useDeleteCombo()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedCombo, setSelectedCombo] = useState<Combo | null>(null)
  const [search, setSearch] = useState('')
  
  // Form states
  const [createForm, setCreateForm] = useState<CreateComboDto>({
    name: "",
    price: 0,
    year: new Date().getFullYear(),
    minPersons: 1,
    eventId: "event-1" // Default event ID
  })
  
  const [editForm, setEditForm] = useState<UpdateComboDto>({})

  const handleCreateCombo = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = await createCombo(createForm)
    if (result) {
      toast.success("Combo creado exitosamente")
      setIsCreateDialogOpen(false)
      setCreateForm({
        name: "",
        price: 0,
        year: new Date().getFullYear(),
        minPersons: 1,
        eventId: "event-1"
      })
      refetch()
    } else {
      toast.error("Error al crear combo")
    }
  }

  const handleEditCombo = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedCombo) return
    
    const result = await updateCombo(selectedCombo.id, editForm)
    if (result) {
      toast.success("Combo actualizado exitosamente")
      setIsEditDialogOpen(false)
      setSelectedCombo(null)
      setEditForm({})
      refetch()
    } else {
      toast.error("Error al actualizar combo")
    }
  }

  const handleDeleteCombo = async (combo: Combo) => {
    if (!confirm(`¿Estás seguro de eliminar el combo ${combo.name}?`)) return
    
    const result = await deleteCombo(combo.id)
    if (result) {
      toast.success("Combo eliminado exitosamente")
      refetch()
    } else {
      toast.error("Error al eliminar combo")
    }
  }

  const openEditDialog = (combo: Combo) => {
    setSelectedCombo(combo)
    setEditForm({
      name: combo.name,
      price: combo.price,
      year: combo.year,
      minPersons: combo.minPersons,
      eventId: combo.eventId
    })
    setIsEditDialogOpen(true)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price)
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
        Error al cargar combos: {error.message}
      </div>
    )
  }

  // Filter combos
  const filteredCombos = combos.filter(combo => {
    if (combo.deletedAt) return false
    if (!search.trim()) return true
    
    const searchLower = search.toLowerCase()
    return (
      combo.name.toLowerCase().includes(searchLower) ||
      combo.price.toString().includes(search) ||
      combo.year.toString().includes(search) ||
      combo.minPersons.toString().includes(search)
    )
  })
  
  const activeCombos = filteredCombos
  const averagePrice = activeCombos.length > 0 
    ? activeCombos.reduce((sum, combo) => sum + combo.price, 0) / activeCombos.length
    : 0

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Combos</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Combo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Combo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateCombo} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre del combo</Label>
                <Input
                  id="name"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                  placeholder="Ej: Combo Individual"
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Precio (ARS)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={createForm.price}
                  onChange={(e) => setCreateForm({...createForm, price: parseFloat(e.target.value) || 0})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="year">Año</Label>
                <Input
                  id="year"
                  type="number"
                  min="2020"
                  max="2030"
                  value={createForm.year}
                  onChange={(e) => setCreateForm({...createForm, year: parseInt(e.target.value) || new Date().getFullYear()})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="minPersons">Mínimo de personas</Label>
                <Input
                  id="minPersons"
                  type="number"
                  min="1"
                  value={createForm.minPersons}
                  onChange={(e) => setCreateForm({...createForm, minPersons: parseInt(e.target.value) || 1})}
                  required
                />
              </div>
              <Button type="submit" disabled={isCreating} className="w-full">
                {isCreating ? <LoadingSpinner /> : "Crear Combo"}
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
                placeholder="Buscar por nombre, precio, año o mín. personas..."
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
            <CardTitle className="text-sm font-medium">Total Combos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCombos.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precio Promedio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(averagePrice)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Personas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeCombos.reduce((sum, combo) => sum + combo.minPersons, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>Lista de Combos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Gestión de combos disponibles</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Año</TableHead>
                <TableHead>Min. Personas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha de Creación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeCombos.map((combo) => (
                <TableRow key={combo.id}>
                  <TableCell className="font-medium">{combo.name}</TableCell>
                  <TableCell className="font-semibold text-green-600">
                    {formatPrice(combo.price)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{combo.year}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {combo.minPersons} {combo.minPersons === 1 ? 'persona' : 'personas'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">
                      Activo
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(combo.createdAt).toLocaleDateString('es-ES')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(combo)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteCombo(combo)}
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
        {activeCombos.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              No se encontraron combos
            </CardContent>
          </Card>
        ) : (
          activeCombos.map((combo) => (
            <Card key={combo.id}>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{combo.name}</h3>
                      <p className="text-xl font-semibold text-green-600">{formatPrice(combo.price)}</p>
                    </div>
                    <Badge variant="default">Activo</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Año</p>
                      <Badge variant="outline">{combo.year}</Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Min. Personas</p>
                      <Badge variant="secondary">
                        {combo.minPersons} {combo.minPersons === 1 ? 'persona' : 'personas'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground text-sm">Fecha de Creación</p>
                    <p className="font-medium">
                      {new Date(combo.createdAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(combo)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteCombo(combo)}
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
            <DialogTitle>Editar Combo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditCombo} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nombre del combo</Label>
              <Input
                id="edit-name"
                value={editForm.name || ""}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-price">Precio (ARS)</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                min="0"
                value={editForm.price || ""}
                onChange={(e) => setEditForm({...editForm, price: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="edit-year">Año</Label>
              <Input
                id="edit-year"
                type="number"
                min="2020"
                max="2030"
                value={editForm.year || ""}
                onChange={(e) => setEditForm({...editForm, year: parseInt(e.target.value) || new Date().getFullYear()})}
              />
            </div>
            <div>
              <Label htmlFor="edit-minPersons">Mínimo de personas</Label>
              <Input
                id="edit-minPersons"
                type="number"
                min="1"
                value={editForm.minPersons || ""}
                onChange={(e) => setEditForm({...editForm, minPersons: parseInt(e.target.value) || 1})}
              />
            </div>
            <Button type="submit" disabled={isUpdating} className="w-full">
              {isUpdating ? <LoadingSpinner /> : "Actualizar Combo"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}