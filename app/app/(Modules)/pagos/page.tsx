"use client"

import type React from "react"
import { useQueryPayments } from "@/hooks/payments/useQueryPayments"
import { useCreatePayment } from "@/hooks/payments/useCreatePayment"
import { useUpdatePayment } from "@/hooks/payments/useUpdatePayment"
import { useDeletePayment } from "@/hooks/payments/useDeletePayment"
import { usePaymentsSummary } from "@/hooks/payments/usePaymentsSummary"
import { useQueryOrders } from "@/hooks/Orders/useQueryOrders"
import { Payment, CreatePaymentDto, UpdatePaymentDto } from "@/entities/Payment"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { Trash2, Edit, Plus, CreditCard, DollarSign, TrendingUp, Activity, Search, RotateCcw, X, ExternalLink, MoreHorizontal, Eye } from "lucide-react"
import { toast } from "sonner"
import { useDrawer } from '@/hooks/useDrawer'
import { PaymentDetailsContent } from '@/components/GlobalDrawer/templates/PaymentDetailsContent'

export default function PaymentsModule() {
  const { payments, isLoading, error, refetch } = useQueryPayments()
  const { createPayment, isLoading: isCreating } = useCreatePayment()
  const { updatePayment, isLoading: isUpdating } = useUpdatePayment()
  const { deletePayment, isLoading: isDeleting } = useDeletePayment()
  const { summary, isLoading: isSummaryLoading } = usePaymentsSummary()
  const { orders, loading: ordersLoading } = useQueryOrders()
  const { openDrawer, closeDrawer } = useDrawer()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [search, setSearch] = useState('')
  
  // Form states
  const [createForm, setCreateForm] = useState<CreatePaymentDto>({
    year: new Date().getFullYear(),
    orderId: "",
    amount: 0,
    type: "TRANSFER",
    payerName: "",
    payerEmail: "",
    payerDni: ""
  })
  
  const [editForm, setEditForm] = useState<UpdatePaymentDto>({})

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = await createPayment(createForm)
    if (result) {
      toast.success("Pago creado exitosamente")
      setIsCreateDialogOpen(false)
      setCreateForm({
        year: new Date().getFullYear(),
        orderId: "",
        amount: 0,
        type: "TRANSFER",
        payerName: "",
        payerEmail: "",
        payerDni: ""
      })
      refetch()
    } else {
      toast.error("Error al crear pago")
    }
  }

  const handleEditPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPayment) return
    
    const result = await updatePayment(selectedPayment.id, editForm)
    if (result) {
      toast.success("Pago actualizado exitosamente")
      setIsEditDialogOpen(false)
      setSelectedPayment(null)
      setEditForm({})
      refetch()
    } else {
      toast.error("Error al actualizar pago")
    }
  }

  const handleDeletePayment = async (payment: Payment) => {
    if (!confirm(`¿Estás seguro de eliminar el pago de ${payment.payerName}?`)) return
    
    const result = await deletePayment(payment.id)
    if (result) {
      toast.success("Pago eliminado exitosamente")
      refetch()
    } else {
      toast.error("Error al eliminar pago")
    }
  }

  const openEditDialog = (payment: Payment) => {
    setSelectedPayment(payment)
    setEditForm({
      year: payment.year,
      orderId: payment.orderId,
      amount: payment.amount,
      type: payment.type,
      payerEmail: payment.payerEmail,
      payerDni: payment.payerDni,
      externalReference: payment.externalReference
    })
    setIsEditDialogOpen(true)
  }

  const getPaymentTypeBadge = (type: string) => {
    switch (type) {
      case 'TRANSFER': return { variant: 'default' as const, label: 'Transferencia', color: 'text-blue-600' }
      case 'MERCADOPAGO': return { variant: 'secondary' as const, label: 'MercadoPago', color: 'text-yellow-600' }
      case 'CASH': return { variant: 'outline' as const, label: 'Efectivo', color: 'text-green-600' }
      default: return { variant: 'default' as const, label: type, color: 'text-gray-600' }
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price)
  }

  const handleOpenDetails = (payment: Payment) => {
    openDrawer(payment, (data) => (
      <PaymentDetailsContent payment={data} />
    ))
  }

  if (isLoading || isSummaryLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        Error al cargar pagos: {error.message}
      </div>
    )
  }

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    if (payment.deletedAt) return false
    if (!search.trim()) return true
    
    const searchLower = search.toLowerCase()
    return (
      payment.payerName?.toLowerCase().includes(searchLower) ||
      payment.payerEmail?.toLowerCase().includes(searchLower) ||
      payment.payerDni?.includes(search) ||
      payment.amount.toString().includes(search) ||
      payment.type.toLowerCase().includes(searchLower) ||
      payment.orderId.toLowerCase().includes(searchLower) ||
      payment.externalReference?.toLowerCase().includes(searchLower)
    )
  })
  
  const activePayments = filteredPayments

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Pagos</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Pago
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Pago</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePayment} className="space-y-4">
              <div>
                <Label htmlFor="payerName">Nombre del pagador</Label>
                <Input
                  id="payerName"
                  value={createForm.payerName}
                  onChange={(e) => setCreateForm({...createForm, payerName: e.target.value})}
                  placeholder="Nombre completo"
                  required
                />
              </div>
              <div>
                <Label htmlFor="payerEmail">Email del pagador</Label>
                <Input
                  id="payerEmail"
                  type="email"
                  value={createForm.payerEmail}
                  onChange={(e) => setCreateForm({...createForm, payerEmail: e.target.value})}
                  placeholder="email@ejemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="payerDni">DNI del pagador</Label>
                <Input
                  id="payerDni"
                  value={createForm.payerDni}
                  onChange={(e) => setCreateForm({...createForm, payerDni: e.target.value})}
                  placeholder="12345678"
                />
              </div>
              <div>
                <Label htmlFor="amount">Monto (ARS)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={createForm.amount}
                  onChange={(e) => setCreateForm({...createForm, amount: parseFloat(e.target.value) || 0})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Tipo de pago</Label>
                <Select value={createForm.type} onValueChange={(value) => setCreateForm({...createForm, type: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TRANSFER">Transferencia</SelectItem>
                    <SelectItem value="MERCADOPAGO">MercadoPago</SelectItem>
                    <SelectItem value="CASH">Efectivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="orderId">Orden</Label>
                <Select value={createForm.orderId} onValueChange={(value) => setCreateForm({...createForm, orderId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar orden" />
                  </SelectTrigger>
                  <SelectContent>
                    {orders.map((order) => (
                      <SelectItem key={order.id} value={order.id}>
                        {order.id} - {order.email} - {order.cuil}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <Button type="submit" disabled={isCreating} className="w-full">
                {isCreating ? <LoadingSpinner /> : "Registrar Pago"}
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
                placeholder="Buscar por pagador, email, DNI, monto, tipo, orden..."
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pagos</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalPayments || activePayments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monto Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(summary?.totalAmount || activePayments.reduce((sum, p) => sum + p.amount, 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transferencias</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {summary?.paymentsByType?.TRANSFER || activePayments.filter(p => p.type === 'TRANSFER').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MercadoPago</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {summary?.paymentsByType?.MERCADOPAGO || activePayments.filter(p => p.type === 'MERCADOPAGO').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>Lista de Pagos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Gestión de pagos registrados</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID Pago</TableHead>
                <TableHead>Pagador</TableHead>
                <TableHead>ID Orden</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activePayments.map((payment) => {
                const typeBadge = getPaymentTypeBadge(payment.type)
                return (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-sm">
                      {payment.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{payment.payerName}</div>
                        {payment.payerEmail && (
                          <div className="text-sm text-gray-500">{payment.payerEmail}</div>
                        )}
                        {payment.payerDni && (
                          <div className="text-xs text-gray-400">DNI: {payment.payerDni}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {payment.orderId}
                    </TableCell>
                    <TableCell>
                      {new Date(payment.createdAt).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {formatPrice(payment.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenDetails(payment)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.open(`https://consagradosajesus.com/descargar-entrada/${payment.id}`, '_blank')}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Ver Entrada
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(payment)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeletePayment(payment)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {activePayments.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              No se encontraron pagos
            </CardContent>
          </Card>
        ) : (
          activePayments.map((payment) => {
            const typeBadge = getPaymentTypeBadge(payment.type)
            return (
              <Card key={payment.id}>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{payment.payerName}</h3>
                        {payment.payerEmail && (
                          <p className="text-sm text-muted-foreground">{payment.payerEmail}</p>
                        )}
                        {payment.payerDni && (
                          <p className="text-xs text-muted-foreground">DNI: {payment.payerDni}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">{formatPrice(payment.amount)}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">ID Pago</p>
                        <p className="font-mono text-xs break-all">{payment.id}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">ID Orden</p>
                        <p className="font-mono text-sm">{payment.orderId}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-muted-foreground text-sm">Fecha</p>
                      <p className="font-medium">
                        {new Date(payment.createdAt).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenDetails(payment)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.open(`https://consagradosajesus.com/descargar-entrada/${payment.id}`, '_blank')}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Ver Entrada
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(payment)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeletePayment(payment)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Pago</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditPayment} className="space-y-4">
            <div>
              <Label htmlFor="edit-payerEmail">Email del pagador</Label>
              <Input
                id="edit-payerEmail"
                type="email"
                value={editForm.payerEmail || ""}
                onChange={(e) => setEditForm({...editForm, payerEmail: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-payerDni">DNI del pagador</Label>
              <Input
                id="edit-payerDni"
                value={editForm.payerDni || ""}
                onChange={(e) => setEditForm({...editForm, payerDni: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-amount">Monto (ARS)</Label>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                min="0"
                value={editForm.amount || ""}
                onChange={(e) => setEditForm({...editForm, amount: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="edit-orderId">Orden</Label>
              <Select value={editForm.orderId || ""} onValueChange={(value) => setEditForm({...editForm, orderId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar orden" />
                </SelectTrigger>
                <SelectContent>
                  {orders.map((order) => (
                    <SelectItem key={order.id} value={order.id}>
                      {order.id} - {order.email} - {order.cuil}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-type">Tipo de pago</Label>
              <Select value={editForm.type} onValueChange={(value) => setEditForm({...editForm, type: value as any})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRANSFER">Transferencia</SelectItem>
                  <SelectItem value="MERCADOPAGO">MercadoPago</SelectItem>
                  <SelectItem value="CASH">Efectivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-externalReference">Referencia externa</Label>
              <Input
                id="edit-externalReference"
                value={editForm.externalReference || ""}
                onChange={(e) => setEditForm({...editForm, externalReference: e.target.value})}
                placeholder="TXN001, MP001, etc."
              />
            </div>
            <Button type="submit" disabled={isUpdating} className="w-full">
              {isUpdating ? <LoadingSpinner /> : "Actualizar Pago"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}