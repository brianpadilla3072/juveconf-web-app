"use client"

import type React from "react"
import { useQueryPreSales } from "@/hooks/presales/useQueryPreSales"
import { useQueryCombos } from "@/hooks/combos/useQueryCombos"
import { useQueryEvents } from "@/hooks/Events/useQueryEvents"
import { useCreatePreSale } from "@/hooks/presales/useCreatePreSale"
import { useUpdatePreSale } from "@/hooks/presales/useUpdatePreSale"
import { useDeletePreSale } from "@/hooks/presales/useDeletePreSale"
import { PreSale, CreatePreSaleDto, UpdatePreSaleDto } from "@/entities/PreSale"
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
import { Textarea } from "@/components/ui/textarea"
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
import { Trash2, Edit, Plus, Tag, Calendar, RotateCcw, DollarSign, Eye } from "lucide-react"
import { toast } from "sonner"
import { useDrawer } from '@/hooks/useDrawer'
import { PreSaleDetailsContent } from '@/components/GlobalDrawer/templates/PreSaleDetailsContent'
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function PreSalesModule() {
  const { preSales, isLoading, error, refetch } = useQueryPreSales()
  const { combos } = useQueryCombos()
  const { events, isLoading: isLoadingEvents } = useQueryEvents()
  const { createPreSale, isLoading: isCreating } = useCreatePreSale()
  const { updatePreSale, isLoading: isUpdating } = useUpdatePreSale()
  const { deletePreSale, isLoading: isDeleting } = useDeletePreSale()

  // Drawer
  const { openDrawer, closeDrawer } = useDrawer()

  // Filtrar solo eventos activos (no eliminados, año actual o futuro)
  const currentYear = new Date().getFullYear()
  const activeEvents = events?.filter(e =>
    !e.deletedAt &&
    e.year >= currentYear
  ) || []

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedPreSale, setSelectedPreSale] = useState<PreSale | null>(null)

  // Form states
  const [createForm, setCreateForm] = useState<CreatePreSaleDto>({
    eventId: activeEvents[0]?.id || "",
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    isActive: true,
    comboPrices: []
  })

  const [editForm, setEditForm] = useState<UpdatePreSaleDto>({})

  const handleCreatePreSale = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validación: evento requerido
    if (!createForm.eventId) {
      toast.error("Debes seleccionar un evento")
      return
    }

    // Validación: al menos un combo
    if (createForm.comboPrices.length === 0) {
      toast.error("Debes agregar al menos un combo con precio")
      return
    }

    // Validación: fechas
    const startDate = new Date(createForm.startDate)
    const endDate = new Date(createForm.endDate)

    if (startDate >= endDate) {
      toast.error("La fecha de fin debe ser posterior a la fecha de inicio")
      return
    }

    // Convertir fechas a ISO
    const preSaleData = {
      ...createForm,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    }

    const result = await createPreSale(preSaleData)
    if (result) {
      toast.success("Preventa creada exitosamente")
      setIsCreateDialogOpen(false)
      setCreateForm({
        eventId: activeEvents[0]?.id || "",
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        isActive: true,
        comboPrices: []
      })
      refetch()
    } else {
      toast.error("Error al crear preventa")
    }
  }

  const handleEditPreSale = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPreSale) return

    // Validación de fechas si se están modificando
    if (editForm.startDate && editForm.endDate) {
      const startDate = new Date(editForm.startDate)
      const endDate = new Date(editForm.endDate)

      if (startDate >= endDate) {
        toast.error("La fecha de fin debe ser posterior a la fecha de inicio")
        return
      }
    }

    // Convertir fechas a ISO si existen
    const updateData = {
      ...editForm,
      startDate: editForm.startDate ? new Date(editForm.startDate).toISOString() : undefined,
      endDate: editForm.endDate ? new Date(editForm.endDate).toISOString() : undefined,
    }

    const result = await updatePreSale(selectedPreSale.id, updateData)
    if (result) {
      toast.success("Preventa actualizada exitosamente")
      setIsEditDialogOpen(false)
      setSelectedPreSale(null)
      setEditForm({})
      refetch()
    } else {
      toast.error("Error al actualizar preventa")
    }
  }

  const handleDeletePreSale = async (preSale: PreSale) => {
    if (!confirm(`¿Estás seguro de eliminar la preventa ${preSale.name}?`)) return

    const result = await deletePreSale(preSale.id)
    if (result) {
      toast.success("Preventa eliminada exitosamente")
      refetch()
    } else {
      toast.error("Error al eliminar preventa")
    }
  }

  const openEditDialog = (preSale: PreSale) => {
    setSelectedPreSale(preSale)
    setEditForm({
      name: preSale.name,
      description: preSale.description,
      // Convertir ISO a formato datetime-local (yyyy-MM-ddThh:mm)
      startDate: preSale.startDate ? new Date(preSale.startDate).toISOString().slice(0, 16) : "",
      endDate: preSale.endDate ? new Date(preSale.endDate).toISOString().slice(0, 16) : "",
      isActive: preSale.isActive,
      comboPrices: preSale.comboPrices?.map(cp => ({
        comboId: cp.comboId,
        price: cp.price
      })) || []
    })
    setIsEditDialogOpen(true)
  }

  const addComboPrice = (comboId: string, isEdit = false) => {
    const combo = combos.find(c => c.id === comboId)
    if (!combo) return

    if (isEdit) {
      const existingPrices = editForm.comboPrices || []
      if (existingPrices.some(cp => cp.comboId === comboId)) return

      setEditForm({
        ...editForm,
        comboPrices: [...existingPrices, { comboId, price: combo.price }]
      })
    } else {
      if (createForm.comboPrices.some(cp => cp.comboId === comboId)) return

      setCreateForm({
        ...createForm,
        comboPrices: [...createForm.comboPrices, { comboId, price: combo.price }]
      })
    }
  }

  const removeComboPrice = (comboId: string, isEdit = false) => {
    if (isEdit) {
      setEditForm({
        ...editForm,
        comboPrices: (editForm.comboPrices || []).filter(cp => cp.comboId !== comboId)
      })
    } else {
      setCreateForm({
        ...createForm,
        comboPrices: createForm.comboPrices.filter(cp => cp.comboId !== comboId)
      })
    }
  }

  const updateComboPrice = (comboId: string, price: number, isEdit = false) => {
    if (isEdit) {
      setEditForm({
        ...editForm,
        comboPrices: (editForm.comboPrices || []).map(cp =>
          cp.comboId === comboId ? { ...cp, price } : cp
        )
      })
    } else {
      setCreateForm({
        ...createForm,
        comboPrices: createForm.comboPrices.map(cp =>
          cp.comboId === comboId ? { ...cp, price } : cp
        )
      })
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isPreSaleActive = (preSale: PreSale) => {
    if (!preSale.isActive) return false
    const now = new Date()
    const start = new Date(preSale.startDate)
    const end = new Date(preSale.endDate)
    return now >= start && now <= end
  }

  const getAvailableCombos = (eventId: string) => {
    if (!eventId) return []
    return combos.filter(c =>
      c.eventId === eventId &&
      c.isActive === true &&
      c.isPublished === true &&
      !c.deletedAt
    )
  }

  const handleOpenDetails = (preSale: PreSale) => {
    openDrawer(preSale, (data) => (
      <PreSaleDetailsContent preSale={data} />
    ));
  };

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
        Error al cargar preventas: {error.message}
      </div>
    )
  }

  const activePreSales = preSales.filter(ps => !ps.deletedAt)
  const currentlyActive = activePreSales.filter(isPreSaleActive)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Preventas</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Preventa
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nueva Preventa</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePreSale} className="space-y-4">
              <div>
                <Label htmlFor="eventId">Evento</Label>
                {isLoadingEvents ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                    <LoadingSpinner />
                    Cargando eventos...
                  </div>
                ) : activeEvents.length === 0 ? (
                  <div className="text-sm text-destructive py-2">
                    No hay eventos disponibles. Crea un evento primero.
                  </div>
                ) : (
                  <Select
                    value={createForm.eventId}
                    onValueChange={(value) => {
                      setCreateForm({...createForm, eventId: value, comboPrices: []})
                    }}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un evento" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeEvents.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.topic} ({event.year})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div>
                <Label htmlFor="name">Nombre de la preventa</Label>
                <Input
                  id="name"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                  placeholder="Ej: Preventa Mayo-Junio"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={createForm.description}
                  onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                  placeholder="Descripción de la preventa..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Fecha de inicio</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={createForm.startDate}
                    onChange={(e) => setCreateForm({...createForm, startDate: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Fecha de fin</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={createForm.endDate}
                    onChange={(e) => setCreateForm({...createForm, endDate: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={createForm.isActive}
                  onCheckedChange={(checked) => setCreateForm({...createForm, isActive: !!checked})}
                />
                <Label htmlFor="isActive" className="cursor-pointer">Activar preventa</Label>
              </div>

              <div className="border-t pt-4">
                <Label className="text-base font-semibold">Precios por Combo</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Selecciona los combos y define sus precios para esta preventa
                </p>

                <div className="space-y-3">
                  {getAvailableCombos(createForm.eventId).map(combo => {
                    const comboPrice = createForm.comboPrices.find(cp => cp.comboId === combo.id)
                    const isSelected = !!comboPrice

                    return (
                      <div key={combo.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              addComboPrice(combo.id, false)
                            } else {
                              removeComboPrice(combo.id, false)
                            }
                          }}
                        />
                        <div className="flex-1">
                          <p className="font-medium">{combo.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Precio base: {formatPrice(combo.price)}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="w-32">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={comboPrice.price}
                              onChange={(e) => updateComboPrice(combo.id, parseFloat(e.target.value) || 0, false)}
                              placeholder="Precio"
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <Button type="submit" disabled={isCreating} className="w-full">
                {isCreating ? <LoadingSpinner /> : "Crear Preventa"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Refresh Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-end">
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
            <CardTitle className="text-sm font-medium">Total Preventas</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePreSales.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activas Ahora</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {currentlyActive.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Combos con Descuento</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentlyActive.reduce((sum, ps) => sum + (ps.comboPrices?.length || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>Lista de Preventas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Gestión de preventas disponibles</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Fecha Inicio</TableHead>
                <TableHead>Fecha Fin</TableHead>
                <TableHead>Combos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activePreSales.map((preSale) => (
                <TableRow key={preSale.id}>
                  <TableCell className="font-medium">{preSale.name}</TableCell>
                  <TableCell>
                    {preSale.event ? (
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-sm">{preSale.event.topic}</span>
                        <Badge variant="outline" className="w-fit text-xs">
                          {preSale.event.year}
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Sin evento</span>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(preSale.startDate)}</TableCell>
                  <TableCell>{formatDate(preSale.endDate)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {preSale.comboPrices?.length || 0} combos
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {isPreSaleActive(preSale) ? (
                      <Badge variant="default" className="bg-green-600">Activa</Badge>
                    ) : preSale.isActive ? (
                      <Badge variant="outline">Programada</Badge>
                    ) : (
                      <Badge variant="secondary">Inactiva</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDetails(preSale)}
                        className="bg-violet-50 hover:bg-violet-100 border-violet-200"
                      >
                        <Eye className="w-4 h-4 text-violet-600" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(preSale)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePreSale(preSale)}
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
        {activePreSales.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              No se encontraron preventas
            </CardContent>
          </Card>
        ) : (
          activePreSales.map((preSale) => (
            <Card key={preSale.id}>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{preSale.name}</h3>
                      {preSale.description && (
                        <p className="text-sm text-muted-foreground">{preSale.description}</p>
                      )}
                    </div>
                    {isPreSaleActive(preSale) ? (
                      <Badge variant="default" className="bg-green-600">Activa</Badge>
                    ) : preSale.isActive ? (
                      <Badge variant="outline">Programada</Badge>
                    ) : (
                      <Badge variant="secondary">Inactiva</Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Inicio</p>
                      <p className="font-medium">{formatDate(preSale.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Fin</p>
                      <p className="font-medium">{formatDate(preSale.endDate)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-muted-foreground text-sm">Combos incluidos</p>
                    <Badge variant="secondary">
                      {preSale.comboPrices?.length || 0} combos
                    </Badge>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDetails(preSale)}
                      className="bg-violet-50 hover:bg-violet-100 border-violet-200"
                    >
                      <Eye className="w-4 h-4 mr-1 text-violet-600" />
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(preSale)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeletePreSale(preSale)}
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
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Preventa</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditPreSale} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nombre de la preventa</Label>
              <Input
                id="edit-name"
                value={editForm.name || ""}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Descripción</Label>
              <Textarea
                id="edit-description"
                value={editForm.description || ""}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-startDate">Fecha de inicio</Label>
                <Input
                  id="edit-startDate"
                  type="datetime-local"
                  value={editForm.startDate || ""}
                  onChange={(e) => setEditForm({...editForm, startDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-endDate">Fecha de fin</Label>
                <Input
                  id="edit-endDate"
                  type="datetime-local"
                  value={editForm.endDate || ""}
                  onChange={(e) => setEditForm({...editForm, endDate: e.target.value})}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-isActive"
                checked={editForm.isActive ?? false}
                onCheckedChange={(checked) => setEditForm({...editForm, isActive: !!checked})}
              />
              <Label htmlFor="edit-isActive" className="cursor-pointer">Activar preventa</Label>
            </div>

            <div className="border-t pt-4">
              <Label className="text-base font-semibold">Precios por Combo</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Selecciona los combos y define sus precios para esta preventa
              </p>

              <div className="space-y-3">
                {combos.filter(c => c.isActive !== false).map(combo => {
                  const comboPrice = (editForm.comboPrices || []).find(cp => cp.comboId === combo.id)
                  const isSelected = !!comboPrice

                  return (
                    <div key={combo.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            addComboPrice(combo.id, true)
                          } else {
                            removeComboPrice(combo.id, true)
                          }
                        }}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{combo.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Precio base: {formatPrice(combo.price)}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-32">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={comboPrice.price}
                            onChange={(e) => updateComboPrice(combo.id, parseFloat(e.target.value) || 0, true)}
                            placeholder="Precio"
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <Button type="submit" disabled={isUpdating} className="w-full">
              {isUpdating ? <LoadingSpinner /> : "Actualizar Preventa"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
