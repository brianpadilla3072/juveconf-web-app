'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios.config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, Plus, Edit, Trash2, Users, UserCheck, Calendar, RotateCcw, QrCode, Download, Eye } from 'lucide-react';
import { useQueryInvitees } from '@/hooks/invitees/useQueryInvitees';
import { InviteeDetailsContent } from '@/components/GlobalDrawer/templates/InviteeDetailsContent';
import { useDrawer } from '@/hooks/useDrawer';
import {
  useCreateInvitee,
  useUpdateInvitee,
  useDeleteInvitee,
  useMarkAttendance
} from '@/hooks/invitees/useMutateInvitee';
import { useQueryPayments } from '@/hooks/payments/useQueryPayments';
import { useQueryCurrentEvent, useQueryEvents } from '@/hooks/Events/useQueryEvents';
import { useQueryCombos } from '@/hooks/combos/useQueryCombos';
import QRAttendanceScanner from '@/components/attendance/QRAttendanceScanner';
import AttendanceModal from '@/components/attendance/AttendanceModal';
import AttendanceMethodModal from '@/components/attendance/AttendanceMethodModal';
import InviteeSearchInput from '@/components/attendance/InviteeSearchInput';
import { useQRAttendance } from '@/hooks/attendance/useQRAttendance';
import { ExportDialog } from '@/components/invitees/ExportDialog';
import { toast } from 'sonner';
import { Attendance } from '@/entities/Invitee';

export default function InviteesPage() {
  const [search, setSearch] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [selectedComboId, setSelectedComboId] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingInvitee, setEditingInvitee] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    cuil: '',
    email: '',
    phone: '',
    orderId: '',
    paymentId: ''
  });

  // Estados para QR Scanner y modal de asistencia
  const [isAttendanceMethodModalOpen, setIsAttendanceMethodModalOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isManualSearchOpen, setIsManualSearchOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);

  // Estados para asistencia rápida desde tabla
  const [selectedInviteeForAttendance, setSelectedInviteeForAttendance] = useState<any>(null);
  const [isQuickAttendanceModalOpen, setIsQuickAttendanceModalOpen] = useState(false);

  // Estado para dialog de exportación
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  // Hook para drawer global
  const { openDrawer, closeDrawer } = useDrawer();

  // Hook para manejo de asistencia por QR
  const {
    fetchInviteeByQR,
    confirmAttendance,
    clearData,
    inviteeData,
    isLoading: isQRLoading
  } = useQRAttendance();

  // Queries
  const { invitees, isLoading, error, refetch } = useQueryInvitees({
    eventId: selectedEventId !== 'all' ? selectedEventId : undefined,
    comboId: selectedComboId !== 'all' ? selectedComboId : undefined
  });
  const { payments } = useQueryPayments();
  const { event, isLoading: isLoadingEvent } = useQueryCurrentEvent();
  const { events: allEvents } = useQueryEvents();
  const { combos: allCombos } = useQueryCombos();

  // Mutations
  const { createInvitee, isLoading: isCreating } = useCreateInvitee();
  const { updateInvitee, isLoading: isUpdating } = useUpdateInvitee();
  const { deleteInvitee, isLoading: isDeleting } = useDeleteInvitee();
  const { markAttendance, isLoading: isMarkingAttendance } = useMarkAttendance();

  // Filtered invitees
  const filteredInvitees = invitees?.filter(invitee =>
    invitee.name.toLowerCase().includes(search.toLowerCase()) ||
    invitee.cuil.includes(search) ||
    (invitee.email && invitee.email.toLowerCase().includes(search.toLowerCase())) ||
    (invitee.phone && invitee.phone.includes(search))
  ) || [];

  // Helper para verificar asistencia de un invitado a un día específico
  const hasAttended = (attendance: Attendance | undefined, dayNumber: number): boolean => {
    return attendance?.days?.[dayNumber.toString()]?.attended || false;
  };

  // Stats dinámicas basadas en los días del evento
  const totalInvitees = filteredInvitees.length;
  const eventDays = event?.eventDays?.days || [];

  // Calcular asistencia por cada día del evento dinámicamente
  const attendanceByDay = eventDays.map(day => ({
    dayNumber: day.dayNumber,
    label: day.label || `Día ${day.dayNumber}`,
    count: filteredInvitees.filter(inv => hasAttended(inv.attendance, day.dayNumber)).length
  }));

  const handleCreate = async () => {
    const result = await createInvitee(formData);
    if (result) {
      setIsCreateDialogOpen(false);
      setFormData({ name: '', cuil: '', email: '', phone: '', orderId: '', paymentId: '' });
      refetch(); // Refrescar la lista
    }
  };

  const handleEdit = (invitee: any) => {
    setEditingInvitee(invitee);
    setFormData({
      name: invitee.name,
      cuil: invitee.cuil,
      email: invitee.email || '',
      phone: invitee.phone || '',
      orderId: invitee.orderId,
      paymentId: invitee.paymentId
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (editingInvitee) {
      const result = await updateInvitee(editingInvitee.id, { 
        name: formData.name, 
        cuil: formData.cuil,
        email: formData.email || undefined,
        phone: formData.phone || undefined
      });
      if (result) {
        setIsEditDialogOpen(false);
        setEditingInvitee(null);
        setFormData({ name: '', cuil: '', email: '', phone: '', orderId: '', paymentId: '' });
        refetch(); // Refrescar la lista
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este invitado?')) {
      const result = await deleteInvitee(id);
      if (result) {
        refetch(); // Refrescar la lista
      }
    }
  };

  const handleAttendanceChange = async (inviteeId: string, dayNumber: number, attended: boolean) => {
    try {
      await api.patch(`/invitees/${inviteeId}/attendance/day`, {
        dayNumber,
        attended
      });
      refetch(); // Refrescar la lista
      toast.success(`Asistencia actualizada para Día ${dayNumber}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al actualizar asistencia');
    }
  };

  const handleOpenDetails = (invitee: any) => {
    openDrawer(invitee, (data) => (
      <InviteeDetailsContent
        invitee={data}
        onEdit={handleEdit}
        onDelete={(id) => {
          handleDelete(id);
          closeDrawer();
        }}
        event={event}
        onAttendanceChange={handleAttendanceChange}
      />
    ));
  };

  // Manejar escaneo QR exitoso
  const handleQRScanned = async (qrData: { inviteId: string; paymentId: string }) => {
    setIsQRScannerOpen(false);

    const invitee = await fetchInviteeByQR(qrData);
    if (invitee) {
      setIsAttendanceModalOpen(true);
    }
  };

  // Confirmar asistencia desde modal QR
  const handleConfirmQRAttendance = async (data: {
    inviteeId: string;
    dayNumber: number;
    email?: string;
    phone?: string;
    notes?: string;
  }) => {
    const success = await confirmAttendance(data);
    if (success) {
      setIsAttendanceModalOpen(false);
      clearData();
      refetch(); // Refrescar la lista
    }
  };

  // Cerrar modal de asistencia
  const handleCloseAttendanceModal = () => {
    setIsAttendanceModalOpen(false);
    clearData();
  };

  // Manejar selección de método QR
  const handleSelectQR = () => {
    setIsAttendanceMethodModalOpen(false);
    setIsQRScannerOpen(true);
  };

  // Manejar selección de método Manual
  const handleSelectManual = () => {
    setIsAttendanceMethodModalOpen(false);
    setIsManualSearchOpen(true);
  };

  // Manejar selección de invitado desde búsqueda manual
  const handleManualInviteeSelect = async (invitee: any) => {
    // 1. Cerrar modal de búsqueda
    setIsManualSearchOpen(false);

    // 2. Abrir modal de asistencia (mostrará loading state mientras se cargan datos)
    setIsAttendanceModalOpen(true);

    // 3. Cargar datos del invitado
    // paymentId es opcional - puede ser undefined si el invitado no tiene pago
    const result = await fetchInviteeByQR({
      inviteId: invitee.id,
      paymentId: invitee.payment?.id || invitee.paymentId
    });

    // 4. Si hay error, cerrar el modal
    if (!result) {
      setIsAttendanceModalOpen(false);
      // fetchInviteeByQR ya mostró el error con toast
    }
  };

  // Cancelar búsqueda manual
  const handleCancelManualSearch = () => {
    setIsManualSearchOpen(false);
  };

  // Handler para abrir modal de asistencia desde fila de tabla
  const handleOpenQuickAttendance = (invitee: any) => {
    setSelectedInviteeForAttendance(invitee);
    setIsQuickAttendanceModalOpen(true);
  };

  // Handler para confirmar asistencia desde modal rápido
  const handleQuickAttendanceConfirm = async (data: {
    inviteeId: string;
    dayNumber: number;
    email?: string;
    phone?: string;
    notes?: string;
  }) => {
    try {
      // Registrar asistencia
      await api.patch(`/invitees/${data.inviteeId}/attendance/day`, {
        dayNumber: data.dayNumber,
        attended: true,
        notes: data.notes
      });

      // Actualizar email/phone si fueron proporcionados
      if (data.email || data.phone) {
        await api.patch(`/invitees/${data.inviteeId}`, {
          ...(data.email && { email: data.email }),
          ...(data.phone && { phone: data.phone })
        });
      }

      setIsQuickAttendanceModalOpen(false);
      setSelectedInviteeForAttendance(null);
      refetch();
      toast.success('Asistencia registrada correctamente');
    } catch (error: any) {
      console.error('Error al registrar asistencia:', error);
      toast.error(error.response?.data?.message || 'Error al registrar asistencia');
    }
  };


  if (error) {
    return <div className="p-4 text-red-600">Error al cargar invitados</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Invitados</h1>
          <p className="text-muted-foreground">
            Administra los invitados registrados en el sistema
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => setIsExportDialogOpen(true)}
            disabled={!event || !filteredInvitees || filteredInvitees.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar Invitados
          </Button>

          <Button
            onClick={() => setIsAttendanceMethodModalOpen(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <QrCode className="mr-2 h-4 w-4" />
            Tomar Asistencia
          </Button>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-violet-600 hover:bg-violet-700">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Invitado
              </Button>
            </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Invitado</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nombre del invitado"
                />
              </div>
              <div>
                <Label htmlFor="cuil">CUIL</Label>
                <Input
                  id="cuil"
                  value={formData.cuil}
                  onChange={(e) => setFormData(prev => ({ ...prev, cuil: e.target.value }))}
                  placeholder="CUIL del invitado"
                />
              </div>
              <div>
                <Label htmlFor="email">Email (opcional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@ejemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono (opcional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+54 9 11 1234-5678"
                />
              </div>
              <div>
                <Label htmlFor="paymentId">Pago</Label>
                <Select 
                  value={formData.paymentId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, paymentId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar pago" />
                  </SelectTrigger>
                  <SelectContent>
                    {payments?.map((payment) => (
                      <SelectItem key={payment.id} value={payment.id}>
                        {payment.payerName || payment.payerEmail} - ${payment.amount}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleCreate}
                disabled={isCreating}
                className="bg-violet-600 hover:bg-violet-700"
              >
                {isCreating ? 'Creando...' : 'Crear'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Stats Cards - DINÁMICAS */}
      <div className="grid grid-cols-1 md:grid-cols-auto-fit gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invitados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvitees}</div>
          </CardContent>
        </Card>

        {/* Tarjetas dinámicas por cada día del evento */}
        {attendanceByDay.map((dayData) => (
          <Card key={dayData.dayNumber}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Asistieron {dayData.label}</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{dayData.count}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            {/* Primera fila: Campo de búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, CUIL, email o teléfono..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Segunda fila: Selects de filtros y botón actualizar */}
            <div className="flex flex-col md:flex-row gap-2">
              <Select
                value={selectedEventId}
                onValueChange={setSelectedEventId}
              >
                <SelectTrigger className="w-full md:w-[250px]">
                  <SelectValue placeholder="Todos los eventos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los eventos</SelectItem>
                  {allEvents?.map((ev) => (
                    <SelectItem key={ev.id} value={ev.id}>
                      {ev.topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedComboId}
                onValueChange={setSelectedComboId}
              >
                <SelectTrigger className="w-full md:w-[250px]">
                  <SelectValue placeholder="Todos los combos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los combos</SelectItem>
                  {allCombos?.map((combo) => (
                    <SelectItem key={combo.id} value={combo.id}>
                      {combo.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => refetch()}
                disabled={isLoading}
                className="w-full md:w-auto"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Actualizar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Desktop Table View */}
      <Card className="hidden md:block">
        <CardContent className="pt-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>CUIL</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  {/* Columnas dinámicas por cada día del evento */}
                  {eventDays.map((day) => (
                    <TableHead key={day.dayNumber} className="text-center">
                      {day.label || `Día ${day.dayNumber}`}
                    </TableHead>
                  ))}
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4 + eventDays.length + 1} className="text-center">
                      Cargando invitados...
                    </TableCell>
                  </TableRow>
                ) : filteredInvitees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4 + eventDays.length + 1} className="text-center">
                      No se encontraron invitados
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvitees.map((invitee) => (
                    <TableRow key={invitee.id}>
                      <TableCell className="font-medium">{invitee.name}</TableCell>
                      <TableCell>{invitee.cuil}</TableCell>
                      <TableCell>{invitee.email || '-'}</TableCell>
                      <TableCell>{invitee.phone || '-'}</TableCell>
                      {/* Checkboxes dinámicos por cada día del evento */}
                      {eventDays.map((day) => (
                        <TableCell key={day.dayNumber} className="text-center">
                          <Checkbox
                            checked={hasAttended(invitee.attendance, day.dayNumber)}
                            onCheckedChange={(checked) =>
                              handleAttendanceChange(invitee.id, day.dayNumber, checked as boolean)
                            }
                          />
                        </TableCell>
                      ))}
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDetails(invitee)}
                            className="bg-violet-50 hover:bg-violet-100 border-violet-200"
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4 text-violet-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenQuickAttendance(invitee)}
                            className="bg-green-50 hover:bg-green-100 border-green-200"
                            title="Tomar Asistencia"
                          >
                            <Calendar className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(invitee)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(invitee.id)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="pt-6 text-center">
              Cargando invitados...
            </CardContent>
          </Card>
        ) : filteredInvitees.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              No se encontraron invitados
            </CardContent>
          </Card>
        ) : (
          filteredInvitees.map((invitee) => (
            <Card key={invitee.id}>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{invitee.name}</h3>
                      <p className="text-sm text-muted-foreground">CUIL: {invitee.cuil}</p>
                    </div>
                  </div>

                  {/* Asistencias dinámicas por día */}
                  <div className="grid grid-cols-2 gap-4">
                    {eventDays.map((day) => (
                      <div key={day.dayNumber} className="flex items-center space-x-2">
                        <Checkbox
                          checked={hasAttended(invitee.attendance, day.dayNumber)}
                          onCheckedChange={(checked) =>
                            handleAttendanceChange(invitee.id, day.dayNumber, checked as boolean)
                          }
                        />
                        <span className="text-sm">Asistió {day.label || `Día ${day.dayNumber}`}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDetails(invitee)}
                      className="bg-violet-50 hover:bg-violet-100 border-violet-200"
                      title="Ver detalles"
                    >
                      <Eye className="h-4 w-4 mr-1 text-violet-600" />
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenQuickAttendance(invitee)}
                      className="bg-green-50 hover:bg-green-100 border-green-200"
                      title="Tomar Asistencia"
                    >
                      <Calendar className="h-4 w-4 mr-1 text-green-600" />
                      Asist.
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(invitee)}
                      title="Editar"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(invitee.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Invitado</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editName">Nombre</Label>
              <Input
                id="editName"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nombre del invitado"
              />
            </div>
            <div>
              <Label htmlFor="editCuil">CUIL</Label>
              <Input
                id="editCuil"
                value={formData.cuil}
                onChange={(e) => setFormData(prev => ({ ...prev, cuil: e.target.value }))}
                placeholder="CUIL del invitado"
              />
            </div>
            <div>
              <Label htmlFor="editEmail">Email (opcional)</Label>
              <Input
                id="editEmail"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@ejemplo.com"
              />
            </div>
            <div>
              <Label htmlFor="editPhone">Teléfono (opcional)</Label>
              <Input
                id="editPhone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+54 9 11 1234-5678"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleUpdate}
              disabled={isUpdating}
              className="bg-violet-600 hover:bg-violet-700"
            >
              {isUpdating ? 'Actualizando...' : 'Actualizar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Attendance Method Selection Modal */}
      <AttendanceMethodModal
        isOpen={isAttendanceMethodModalOpen}
        onClose={() => setIsAttendanceMethodModalOpen(false)}
        onSelectQR={handleSelectQR}
        onSelectManual={handleSelectManual}
      />

      {/* QR Scanner Component */}
      <QRAttendanceScanner
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onQRScanned={handleQRScanned}
      />

      {/* Manual Invitee Search */}
      <InviteeSearchInput
        isOpen={isManualSearchOpen}
        eventId={selectedEventId !== 'all' ? selectedEventId : event?.id}
        onSelectInvitee={handleManualInviteeSelect}
        onCancel={handleCancelManualSearch}
      />

      {/* Attendance Confirmation Modal (QR/Manual Search) */}
      <AttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={handleCloseAttendanceModal}
        invitee={inviteeData}
        event={event}
        onConfirm={handleConfirmQRAttendance}
        isLoading={isQRLoading}
      />

      {/* Quick Attendance Modal (Table Row) */}
      <AttendanceModal
        isOpen={isQuickAttendanceModalOpen}
        onClose={() => {
          setIsQuickAttendanceModalOpen(false);
          setSelectedInviteeForAttendance(null);
        }}
        invitee={selectedInviteeForAttendance}
        event={event}
        onConfirm={handleQuickAttendanceConfirm}
      />

      {/* Export Dialog */}
      <ExportDialog
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
        defaultEventId={selectedEventId !== 'all' ? selectedEventId : event?.id}
        events={allEvents || []}
        combos={allCombos || []}
        inviteesCount={filteredInvitees?.length || 0}
      />
    </div>
  );
}