'use client';

import { useState } from 'react';
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
import { Search, Plus, Edit, Trash2, Users, UserCheck, Calendar, RotateCcw } from 'lucide-react';
import { useQueryInvitees } from '@/hooks/invitees/useQueryInvitees';
import { 
  useCreateInvitee, 
  useUpdateInvitee, 
  useDeleteInvitee, 
  useMarkAttendance 
} from '@/hooks/invitees/useMutateInvitee';
import { useQueryPayments } from '@/hooks/payments/useQueryPayments';

export default function InviteesPage() {
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
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

  // Queries
  const { invitees, isLoading, error, refetch } = useQueryInvitees({ year: selectedYear });
  const { payments } = useQueryPayments();

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

  // Stats
  const totalInvitees = filteredInvitees.length;
  const attendedDay1 = filteredInvitees.filter(inv => inv.attendedDay1).length;
  const attendedDay2 = filteredInvitees.filter(inv => inv.attendedDay2).length;

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

  const handleAttendanceChange = async (inviteeId: string, day: 'day1' | 'day2', attended: boolean) => {
    const result = await markAttendance(inviteeId, 
      day === 'day1' ? { day1: attended } : { day2: attended }
    );
    if (result) {
      refetch(); // Refrescar la lista
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
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
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
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isCreating ? 'Creando...' : 'Crear'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invitados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvitees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Asistieron Día 1</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{attendedDay1}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Asistieron Día 2</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{attendedDay2}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Año Seleccionado</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{selectedYear}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, CUIL, email o teléfono..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select 
                value={selectedYear.toString()} 
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline"
                onClick={() => refetch()}
                disabled={isLoading}
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
                  <TableHead>Email Pago</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead className="text-center">Día 1</TableHead>
                  <TableHead className="text-center">Día 2</TableHead>
                  <TableHead className="text-center">Estado Orden</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center">
                      Cargando invitados...
                    </TableCell>
                  </TableRow>
                ) : filteredInvitees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center">
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
                      <TableCell>{invitee.payment?.payerEmail || 'N/A'}</TableCell>
                      <TableCell>${invitee.payment?.amount?.toLocaleString()}</TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={invitee.attendedDay1 || false}
                          onCheckedChange={(checked) => 
                            handleAttendanceChange(invitee.id, 'day1', checked as boolean)
                          }
                          disabled={isMarkingAttendance}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={invitee.attendedDay2 || false}
                          onCheckedChange={(checked) => 
                            handleAttendanceChange(invitee.id, 'day2', checked as boolean)
                          }
                          disabled={isMarkingAttendance}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={
                            invitee.order?.status === 'PAID' ? 'default' : 
                            invitee.order?.status === 'PENDING' ? 'secondary' : 'destructive'
                          }
                        >
                          {invitee.order?.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(invitee)}
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
                    <Badge 
                      variant={
                        invitee.order?.status === 'PAID' ? 'default' : 
                        invitee.order?.status === 'PENDING' ? 'secondary' : 'destructive'
                      }
                    >
                      {invitee.order?.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Email Pago</p>
                      <p className="font-medium">{invitee.payment?.payerEmail || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Monto</p>
                      <p className="font-medium">${invitee.payment?.amount?.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={invitee.attendedDay1 || false}
                        onCheckedChange={(checked) => 
                          handleAttendanceChange(invitee.id, 'day1', checked as boolean)
                        }
                        disabled={isMarkingAttendance}
                      />
                      <span className="text-sm">Asistió Día 1</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={invitee.attendedDay2 || false}
                        onCheckedChange={(checked) => 
                          handleAttendanceChange(invitee.id, 'day2', checked as boolean)
                        }
                        disabled={isMarkingAttendance}
                      />
                      <span className="text-sm">Asistió Día 2</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(invitee)}
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
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isUpdating ? 'Actualizando...' : 'Actualizar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}