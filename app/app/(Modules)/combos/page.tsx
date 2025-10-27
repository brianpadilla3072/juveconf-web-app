"use client"

import type React from "react"
import { useQueryCombos } from "@/hooks/combos/useQueryCombos"
import { useCreateCombo } from "@/hooks/combos/useCreateCombo"
import { useUpdateCombo } from "@/hooks/combos/useUpdateCombo"
import { useDeleteCombo } from "@/hooks/combos/useDeleteCombo"
import { useQueryEvents } from "@/hooks/Events/useQueryEvents"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Edit, Plus, Package, DollarSign, Users, Search, RotateCcw, X, List, Eye } from "lucide-react"
import { toast } from "sonner"
import { DetailItemsEditor, DetailItem } from "@/components/combos/DetailItemsEditor"
import { MerchandiseEditor, MerchandiseItem } from "@/components/combos/MerchandiseEditor"
import { BenefitsEditor } from "@/components/combos/BenefitsEditor"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useDrawer } from '@/hooks/useDrawer'
import { ComboDetailsContent } from '@/components/GlobalDrawer/templates/ComboDetailsContent'

export default function CombosModule() {
  const { combos, isLoading, error, refetch } = useQueryCombos()
  const { createCombo, isLoading: isCreating } = useCreateCombo()
  const { updateCombo, isLoading: isUpdating } = useUpdateCombo()
  const { deleteCombo, isLoading: isDeleting } = useDeleteCombo()
  const { events, isLoading: isLoadingEvents } = useQueryEvents()
  const { openDrawer, closeDrawer } = useDrawer()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedCombo, setSelectedCombo] = useState<Combo | null>(null)
  const [search, setSearch] = useState('')
  const [detailItems, setDetailItems] = useState<DetailItem[]>([])
  const [editDetailItems, setEditDetailItems] = useState<DetailItem[]>([])
  const [comboDescription, setComboDescription] = useState('')
  const [editComboDescription, setEditComboDescription] = useState('')

  // Benefits states
  const [benefits, setBenefits] = useState<string[]>([])
  const [editBenefits, setEditBenefits] = useState<string[]>([])

  // Merchandising states
  const [merchandiseEnabled, setMerchandiseEnabled] = useState(false)
  const [merchandiseItems, setMerchandiseItems] = useState<MerchandiseItem[]>([])
  const [editMerchandiseEnabled, setEditMerchandiseEnabled] = useState(false)
  const [editMerchandiseItems, setEditMerchandiseItems] = useState<MerchandiseItem[]>([])

  // Get active events (not deleted)
  const activeEvents = events?.filter(e => !e.deletedAt) || []

  // Form states
  const [createForm, setCreateForm] = useState<CreateComboDto>({
    name: "",
    price: 0,
    personsIncluded: 1,
    eventId: activeEvents[0]?.id || "", // First available event
    isFree: false
  })

  const [editForm, setEditForm] = useState<UpdateComboDto>({})

  const handleCreateCombo = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation: eventId is required
    if (!createForm.eventId) {
      toast.error("Debes seleccionar un evento")
      return
    }

    const comboData = {
      ...createForm,
      metadata: (detailItems.length > 0 || comboDescription || benefits.length > 0 || merchandiseEnabled) ? {
        description: comboDescription || undefined,
        detailItems,
        benefits: benefits.length > 0 ? benefits : undefined,
        merchandise: merchandiseEnabled ? {
          enabled: true,
          allMerchandise: merchandiseItems
        } : undefined
      } : undefined
    }

    const result = await createCombo(comboData)
    if (result) {
      toast.success("Combo creado exitosamente")
      setIsCreateDialogOpen(false)
      setCreateForm({
        name: "",
        price: 0,
        personsIncluded: 1,
        eventId: activeEvents[0]?.id || "",
        isFree: false
      })
      setDetailItems([])
      setComboDescription('')
      setBenefits([])
      setMerchandiseEnabled(false)
      setMerchandiseItems([])
      refetch()
    } else {
      toast.error("Error al crear combo")
    }
  }

  const handleEditCombo = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCombo) return

    const comboData = {
      ...editForm,
      metadata: (editDetailItems.length > 0 || editComboDescription || editBenefits.length > 0 || editMerchandiseEnabled) ? {
        description: editComboDescription || undefined,
        detailItems: editDetailItems,
        benefits: editBenefits.length > 0 ? editBenefits : undefined,
        merchandise: editMerchandiseEnabled ? {
          enabled: true,
          allMerchandise: editMerchandiseItems
        } : undefined
      } : undefined
    }

    const result = await updateCombo(selectedCombo.id, comboData)
    if (result) {
      toast.success("Combo actualizado exitosamente")
      setIsEditDialogOpen(false)
      setSelectedCombo(null)
      setEditForm({})
      setEditDetailItems([])
      setEditComboDescription('')
      setEditBenefits([])
      setEditMerchandiseEnabled(false)
      setEditMerchandiseItems([])
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
      personsIncluded: combo.personsIncluded,
      eventId: combo.eventId,
      isFree: combo.isFree || false
    })
    setEditDetailItems(combo.metadata?.detailItems || [])
    setEditComboDescription(combo.metadata?.description || '')
    setEditBenefits(combo.metadata?.benefits || [])
    setEditMerchandiseEnabled(combo.metadata?.merchandise?.enabled || false)
    setEditMerchandiseItems(combo.metadata?.merchandise?.allMerchandise || [])
    setIsEditDialogOpen(true)
  }

  const handleOpenDetails = (combo: Combo) => {
    openDrawer(combo, (data) => (
      <ComboDetailsContent combo={data} />
    ))
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
      combo.personsIncluded.toString().includes(search) ||
      combo.event?.topic.toLowerCase().includes(searchLower) ||
      combo.event?.year.toString().includes(search)
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
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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
                    onValueChange={(value) => setCreateForm({...createForm, eventId: value})}
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

              <div className="flex items-center space-x-2 py-2">
                <Checkbox
                  id="isFree"
                  checked={createForm.isFree || false}
                  onCheckedChange={(checked) => {
                    setCreateForm({
                      ...createForm,
                      isFree: checked as boolean,
                      price: checked ? 0 : createForm.price
                    })
                  }}
                />
                <Label htmlFor="isFree" className="cursor-pointer font-normal">
                  Combo Gratuito
                </Label>
              </div>

              {!createForm.isFree && (
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
              )}

              {createForm.isFree && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-700 flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Este combo será gratuito (precio: $0)
                  </p>
                </div>
              )}
              <div>
                <Label htmlFor="personsIncluded">Cantidad de personas incluidas</Label>
                <Input
                  id="personsIncluded"
                  type="number"
                  min="1"
                  value={createForm.personsIncluded}
                  onChange={(e) => setCreateForm({...createForm, personsIncluded: parseInt(e.target.value) || 1})}
                  required
                />
              </div>

              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={createForm.isActive ?? true}
                    onCheckedChange={(checked) => setCreateForm({...createForm, isActive: checked as boolean})}
                  />
                  <Label htmlFor="isActive" className="cursor-pointer font-normal">
                    Activado
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPublished"
                    checked={createForm.isPublished ?? false}
                    onCheckedChange={(checked) => setCreateForm({...createForm, isPublished: checked as boolean})}
                  />
                  <Label htmlFor="isPublished" className="cursor-pointer font-normal">
                    Publicado
                  </Label>
                </div>
              </div>

              <div className="border-t pt-4">
                <DetailItemsEditor
                  description={comboDescription}
                  items={detailItems}
                  onDescriptionChange={setComboDescription}
                  onChange={setDetailItems}
                />
              </div>

              <div className="border-t pt-4">
                <BenefitsEditor
                  benefits={benefits}
                  onChange={setBenefits}
                />
              </div>

              <div className="border-t pt-4">
                <MerchandiseEditor
                  enabled={merchandiseEnabled}
                  items={merchandiseItems}
                  onEnabledChange={setMerchandiseEnabled}
                  onChange={setMerchandiseItems}
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
                placeholder="Buscar por nombre, evento, precio o personas..."
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
              {activeCombos.reduce((sum, combo) => sum + combo.personsIncluded, 0)}
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
                <TableHead>Evento</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Personas Incluidas</TableHead>
                <TableHead>Detalles</TableHead>
                <TableHead>Activo</TableHead>
                <TableHead>Publicado</TableHead>
                <TableHead>Fecha de Creación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeCombos.map((combo) => (
                <TableRow key={combo.id}>
                  <TableCell className="font-medium">
                    {combo.metadata?.description ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help border-b border-dashed border-primary/50">
                              {combo.name}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-sm">{combo.metadata.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      combo.name
                    )}
                  </TableCell>
                  <TableCell>
                    {combo.event ? (
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-sm">{combo.event.topic}</span>
                        <Badge variant="outline" className="w-fit text-xs">
                          {combo.event.year}
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Sin evento</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-green-600">
                        {formatPrice(combo.price)}
                      </span>
                      {combo.isFree && (
                        <Badge variant="secondary" className="w-fit text-xs">
                          GRATUITO
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {combo.personsIncluded} {combo.personsIncluded === 1 ? 'persona' : 'personas'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {combo.metadata?.detailItems?.length > 0 ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDetails(combo)}
                        className="gap-2"
                      >
                        <List className="w-4 h-4" />
                        {combo.metadata.detailItems.length} {combo.metadata.detailItems.length === 1 ? 'item' : 'items'}
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-sm">Sin detalles</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={combo.isActive ? "default" : "secondary"}>
                      {combo.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={combo.isPublished ? "default" : "outline"}>
                      {combo.isPublished ? "Publicado" : "No publicado"}
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
                        onClick={() => handleOpenDetails(combo)}
                        className="bg-violet-50 hover:bg-violet-100 border-violet-200"
                      >
                        <Eye className="w-4 h-4 text-violet-600" />
                      </Button>
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
                    <div className="flex flex-col gap-1">
                      <Badge variant={combo.isActive ? "default" : "secondary"}>
                        {combo.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                      <Badge variant={combo.isPublished ? "default" : "outline"}>
                        {combo.isPublished ? "Publicado" : "No publicado"}
                      </Badge>
                    </div>
                  </div>

                  {combo.event && (
                    <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                      <p className="text-xs text-muted-foreground mb-1">Evento</p>
                      <p className="font-medium text-sm">{combo.event.topic}</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {combo.event.year}
                      </Badge>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Personas Incluidas</p>
                      <Badge variant="secondary">
                        {combo.personsIncluded} {combo.personsIncluded === 1 ? 'persona' : 'personas'}
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
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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
              <Label htmlFor="edit-eventId">Evento</Label>
              {isLoadingEvents ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                  <LoadingSpinner />
                  Cargando eventos...
                </div>
              ) : activeEvents.length === 0 ? (
                <div className="text-sm text-destructive py-2">
                  No hay eventos disponibles.
                </div>
              ) : (
                <Select
                  value={editForm.eventId || ""}
                  onValueChange={(value) => setEditForm({...editForm, eventId: value})}
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

            <div className="flex items-center space-x-2 py-2">
              <Checkbox
                id="edit-isFree"
                checked={editForm.isFree || false}
                onCheckedChange={(checked) => {
                  setEditForm({
                    ...editForm,
                    isFree: checked as boolean,
                    price: checked ? 0 : editForm.price || 0
                  })
                }}
              />
              <Label htmlFor="edit-isFree" className="cursor-pointer font-normal">
                Combo Gratuito
              </Label>
            </div>

            {!editForm.isFree && (
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
            )}

            {editForm.isFree && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-700 flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Este combo será gratuito (precio: $0)
                </p>
              </div>
            )}
            <div>
              <Label htmlFor="edit-personsIncluded">Cantidad de personas incluidas</Label>
              <Input
                id="edit-personsIncluded"
                type="number"
                min="1"
                value={editForm.personsIncluded || ""}
                onChange={(e) => setEditForm({...editForm, personsIncluded: parseInt(e.target.value) || 1})}
              />
            </div>

            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-isActive"
                  checked={editForm.isActive ?? true}
                  onCheckedChange={(checked) => setEditForm({...editForm, isActive: checked as boolean})}
                />
                <Label htmlFor="edit-isActive" className="cursor-pointer font-normal">
                  Activado
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-isPublished"
                  checked={editForm.isPublished ?? false}
                  onCheckedChange={(checked) => setEditForm({...editForm, isPublished: checked as boolean})}
                />
                <Label htmlFor="edit-isPublished" className="cursor-pointer font-normal">
                  Publicado
                </Label>
              </div>
            </div>

            <div className="border-t pt-4">
              <DetailItemsEditor
                description={editComboDescription}
                items={editDetailItems}
                onDescriptionChange={setEditComboDescription}
                onChange={setEditDetailItems}
              />
            </div>

            <div className="border-t pt-4">
              <BenefitsEditor
                benefits={editBenefits}
                onChange={setEditBenefits}
              />
            </div>

            <div className="border-t pt-4">
              <MerchandiseEditor
                enabled={editMerchandiseEnabled}
                items={editMerchandiseItems}
                onEnabledChange={setEditMerchandiseEnabled}
                onChange={setEditMerchandiseItems}
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