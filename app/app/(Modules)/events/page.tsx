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
import { Search, Plus, Edit, Trash2, Calendar, Users, Clock, Copy, Check } from 'lucide-react';
import { useQueryEvents } from '@/hooks/Events/useQueryEvents';
import {
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent
} from '@/hooks/Events/useMutateEvent';
import { toast } from 'sonner';

export default function EventsPage() {
  const [search, setSearch] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    topic: '',
    capacity: 100,
    salesStartDate: '',
    salesEndDate: '',
    eventStartDate: '',
    eventEndDate: '',
    location: '',
    description: ''
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

  const getPublishedCombosUrl = (eventId: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3072';
    return `${apiUrl}/combos/event/${eventId}/published`;
  };

  const isEventFinished = (event: any) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    if (event.eventEndDate) {
      const endDate = new Date(event.eventEndDate);
      endDate.setHours(23, 59, 59, 999); // End of day
      return today > endDate;
    }

    if (event.salesEndDate) {
      const salesEnd = new Date(event.salesEndDate);
      salesEnd.setHours(23, 59, 59, 999);
      return today > salesEnd;
    }

    return false; // Si no hay fechas, asumimos que está activo
  };

  const copyToClipboard = async (url: string, eventId: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(eventId);
      toast.success('URL copiada al portapapeles');
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (err) {
      toast.error('Error al copiar la URL');
    }
  };

  const handleCreate = async () => {
    const result = await createEvent({
      ...formData,
      salesStartDate: formData.salesStartDate,
      salesEndDate: formData.salesEndDate || undefined,
      eventStartDate: formData.eventStartDate || undefined,
      eventEndDate: formData.eventEndDate || undefined,
      location: formData.location || undefined,
      description: formData.description || undefined
    });
    if (result) {
      setIsCreateDialogOpen(false);
      setFormData({
        year: new Date().getFullYear(),
        topic: '',
        capacity: 100,
        salesStartDate: '',
        salesEndDate: '',
        eventStartDate: '',
        eventEndDate: '',
        location: '',
        description: ''
      });
      refetch();
    }
  };

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setFormData({
      year: event.year,
      topic: event.topic,
      capacity: event.capacity,
      salesStartDate: event.salesStartDate?.split('T')[0] || '',
      salesEndDate: event.salesEndDate?.split('T')[0] || '',
      eventStartDate: event.eventStartDate?.split('T')[0] || '',
      eventEndDate: event.eventEndDate?.split('T')[0] || '',
      location: event.location || '',
      description: event.description || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (editingEvent) {
      const result = await updateEvent(editingEvent.id, {
        year: formData.year,
        topic: formData.topic,
        capacity: formData.capacity,
        salesStartDate: formData.salesStartDate,
        salesEndDate: formData.salesEndDate || undefined,
        eventStartDate: formData.eventStartDate || undefined,
        eventEndDate: formData.eventEndDate || undefined,
        location: formData.location || undefined,
        description: formData.description || undefined
      });
      if (result) {
        setIsEditDialogOpen(false);
        setEditingEvent(null);
        setFormData({
          year: new Date().getFullYear(),
          topic: '',
          capacity: 100,
          salesStartDate: '',
          salesEndDate: '',
          eventStartDate: '',
          eventEndDate: '',
          location: '',
          description: ''
        });
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
            <Button className="bg-violet-600 hover:bg-violet-700">
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
              <div>
                <Label htmlFor="salesEndDate">Fecha de Fin de Ventas</Label>
                <Input
                  id="salesEndDate"
                  type="date"
                  value={formData.salesEndDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, salesEndDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="eventStartDate">Fecha de Inicio del Evento</Label>
                <Input
                  id="eventStartDate"
                  type="date"
                  value={formData.eventStartDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, eventStartDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="eventEndDate">Fecha de Fin del Evento</Label>
                <Input
                  id="eventEndDate"
                  type="date"
                  value={formData.eventEndDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, eventEndDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Ubicación del evento"
                />
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Input
                  id="description"
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descripción breve"
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
                className="bg-violet-600 hover:bg-violet-700"
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
            <div className="text-2xl font-bold text-violet-600">{currentYear}</div>
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
                  <TableHead>URL Combos Publicados</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Cargando eventos...
                    </TableCell>
                  </TableRow>
                ) : filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
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
                        <TableCell>
                          {isEventFinished(event) ? (
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                              <span>Evento finalizado</span>
                              <Badge variant="outline" className="text-xs">Sin acceso</Badge>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate max-w-[300px]">
                                {getPublishedCombosUrl(event.id)}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(getPublishedCombosUrl(event.id), event.id)}
                              >
                                {copiedUrl === event.id ? (
                                  <Check className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          )}
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

                    {isEventFinished(event) ? (
                      <div className="bg-muted/50 rounded-lg p-3 border border-violet-200">
                        <p className="text-xs text-muted-foreground font-medium mb-1">Estado del evento</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">Finalizado</Badge>
                          <span className="text-xs text-muted-foreground">URL de combos no disponible</span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-muted/50 rounded-lg p-3 border">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-xs text-muted-foreground font-medium">URL API Combos Publicados</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(getPublishedCombosUrl(event.id), event.id)}
                            className="h-7"
                          >
                            {copiedUrl === event.id ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                        <code className="text-[10px] break-all">
                          {getPublishedCombosUrl(event.id)}
                        </code>
                      </div>
                    )}

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
            <div>
              <Label htmlFor="editSalesEndDate">Fecha de Fin de Ventas</Label>
              <Input
                id="editSalesEndDate"
                type="date"
                value={formData.salesEndDate}
                onChange={(e) => setFormData(prev => ({ ...prev, salesEndDate: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="editEventStartDate">Fecha de Inicio del Evento</Label>
              <Input
                id="editEventStartDate"
                type="date"
                value={formData.eventStartDate}
                onChange={(e) => setFormData(prev => ({ ...prev, eventStartDate: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="editEventEndDate">Fecha de Fin del Evento</Label>
              <Input
                id="editEventEndDate"
                type="date"
                value={formData.eventEndDate}
                onChange={(e) => setFormData(prev => ({ ...prev, eventEndDate: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="editLocation">Ubicación</Label>
              <Input
                id="editLocation"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Ubicación del evento"
              />
            </div>
            <div>
              <Label htmlFor="editDescription">Descripción</Label>
              <Input
                id="editDescription"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descripción del evento"
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
    </div>
  );
}