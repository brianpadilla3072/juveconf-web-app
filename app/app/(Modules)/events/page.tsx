'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { Label } from '@/components/ui/label';
import { Search, Plus, Edit, Trash2, Calendar, Users, Clock } from 'lucide-react';
import { useQueryEvents } from '@/hooks/Events/useQueryEvents';
import { 
  useCreateEvent, 
  useUpdateEvent, 
  useDeleteEvent 
} from '@/hooks/Events/useMutateEvent';

export default function EventsPage() {
  const [search, setSearch] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    topic: '',
    capacity: 100,
    salesStartDate: ''
  });

  // Queries
  const { events, isLoading, error, refetch } = useQueryEvents();

  // Mutations
  const { createEvent, isLoading: isCreating } = useCreateEvent();
  const { updateEvent, isLoading: isUpdating } = useUpdateEvent();
  const { deleteEvent, isLoading: isDeleting } = useDeleteEvent();

  // Filtered events
  const filteredEvents = events?.filter(event =>
    event.topic.toLowerCase().includes(search.toLowerCase()) ||
    event.year.toString().includes(search)
  ) || [];

  // Stats
  const totalEvents = filteredEvents.length;
  const currentYear = new Date().getFullYear();
  const currentYearEvents = filteredEvents.filter(event => event.year === currentYear).length;
  const upcomingEvents = filteredEvents.filter(event => 
    new Date(event.salesStartDate) > new Date()
  ).length;

  const handleCreate = async () => {
    const result = await createEvent({
      ...formData,
      salesStartDate: formData.salesStartDate
    });
    if (result) {
      setIsCreateDialogOpen(false);
      setFormData({ year: new Date().getFullYear(), topic: '', capacity: 100, salesStartDate: '' });
      refetch();
    }
  };

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setFormData({
      year: event.year,
      topic: event.topic,
      capacity: event.capacity,
      salesStartDate: event.salesStartDate.split('T')[0] // Format for date input
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (editingEvent) {
      const result = await updateEvent(editingEvent.id, {
        year: formData.year,
        topic: formData.topic,
        capacity: formData.capacity,
        salesStartDate: formData.salesStartDate
      });
      if (result) {
        setIsEditDialogOpen(false);
        setEditingEvent(null);
        setFormData({ year: new Date().getFullYear(), topic: '', capacity: 100, salesStartDate: '' });
        refetch();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este evento?')) {
      const result = await deleteEvent(id);
      if (result) {
        refetch();
      }
    }
  };

  if (error) {
    return <div className="p-4 text-red-600">Error al cargar eventos</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Eventos</h1>
          <p className="text-muted-foreground">
            Administra los eventos del sistema
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Evento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Evento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="year">Año</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  placeholder="Año del evento"
                />
              </div>
              <div>
                <Label htmlFor="topic">Tema/Título</Label>
                <Input
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                  placeholder="Tema del evento"
                />
              </div>
              <div>
                <Label htmlFor="capacity">Capacidad</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                  placeholder="Capacidad máxima"
                />
              </div>
              <div>
                <Label htmlFor="salesStartDate">Fecha de Inicio de Ventas</Label>
                <Input
                  id="salesStartDate"
                  type="date"
                  value={formData.salesStartDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, salesStartDate: e.target.value }))}
                />
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
            <CardTitle className="text-sm font-medium">Total Eventos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos {currentYear}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{currentYearEvents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximos Eventos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{upcomingEvents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Año Actual</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{currentYear}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por tema o año..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
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
                  <TableHead>Año</TableHead>
                  <TableHead>Tema</TableHead>
                  <TableHead>Capacidad</TableHead>
                  <TableHead>Inicio de Ventas</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Cargando eventos...
                    </TableCell>
                  </TableRow>
                ) : filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No se encontraron eventos
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map((event) => {
                    const isUpcoming = new Date(event.salesStartDate) > new Date();
                    const isCurrentYear = event.year === currentYear;
                    
                    return (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.year}</TableCell>
                        <TableCell>{event.topic}</TableCell>
                        <TableCell>{event.capacity.toLocaleString()}</TableCell>
                        <TableCell>
                          {new Date(event.salesStartDate).toLocaleDateString('es-ES')}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              isUpcoming ? 'secondary' : 
                              isCurrentYear ? 'default' : 'outline'
                            }
                          >
                            {isUpcoming ? 'Próximo' : isCurrentYear ? 'Activo' : 'Pasado'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(event)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(event.id)}
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
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
              Cargando eventos...
            </CardContent>
          </Card>
        ) : filteredEvents.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              No se encontraron eventos
            </CardContent>
          </Card>
        ) : (
          filteredEvents.map((event) => {
            const isUpcoming = new Date(event.salesStartDate) > new Date();
            const isCurrentYear = event.year === currentYear;
            
            return (
              <Card key={event.id}>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{event.topic}</h3>
                        <p className="text-sm text-muted-foreground">Año {event.year}</p>
                      </div>
                      <Badge 
                        variant={
                          isUpcoming ? 'secondary' : 
                          isCurrentYear ? 'default' : 'outline'
                        }
                      >
                        {isUpcoming ? 'Próximo' : isCurrentYear ? 'Activo' : 'Pasado'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Capacidad</p>
                        <p className="font-medium">{event.capacity.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Inicio de Ventas</p>
                        <p className="font-medium">
                          {new Date(event.salesStartDate).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(event)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(event.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Evento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editYear">Año</Label>
              <Input
                id="editYear"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                placeholder="Año del evento"
              />
            </div>
            <div>
              <Label htmlFor="editTopic">Tema/Título</Label>
              <Input
                id="editTopic"
                value={formData.topic}
                onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                placeholder="Tema del evento"
              />
            </div>
            <div>
              <Label htmlFor="editCapacity">Capacidad</Label>
              <Input
                id="editCapacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                placeholder="Capacidad máxima"
              />
            </div>
            <div>
              <Label htmlFor="editSalesStartDate">Fecha de Inicio de Ventas</Label>
              <Input
                id="editSalesStartDate"
                type="date"
                value={formData.salesStartDate}
                onChange={(e) => setFormData(prev => ({ ...prev, salesStartDate: e.target.value }))}
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