'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Calendar, DollarSign, Mail, Phone, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Event, EventDay } from '@/entities/Event';
import { Attendance } from '@/entities/Invitee';

interface InviteeData {
  id: string;
  name: string;
  cuil: string;
  email?: string;
  phone?: string;
  attendance?: Attendance;
  payment?: {
    id: string;
    amount: number;
    payerEmail?: string;
  };
  order?: {
    status: string;
  };
}

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitee: InviteeData | null;
  event: Event | null; // NUEVO: necesitamos los días del evento
  onConfirm: (data: {
    inviteeId: string;
    dayNumber: number;
    email?: string;
    phone?: string;
    notes?: string;
  }) => void;
  isLoading?: boolean;
}

export default function AttendanceModal({
  isOpen,
  onClose,
  invitee,
  event,
  onConfirm,
  isLoading = false
}: AttendanceModalProps) {
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Obtener días del evento
  const eventDays = event?.eventDays?.days || [];

  // Helper para verificar si asistió a un día específico
  const hasAttended = (dayNumber: number): boolean => {
    return invitee?.attendance?.days?.[dayNumber.toString()]?.attended || false;
  };

  // Resetear formulario cuando se abre el modal con nuevos datos
  useEffect(() => {
    if (invitee && isOpen) {
      setEmail(invitee.email || '');
      setPhone(invitee.phone || '');
      setNotes('');
      setSelectedDayNumber(eventDays[0]?.dayNumber || 1); // Por defecto primer día
    }
  }, [invitee, isOpen, eventDays]);

  const handleConfirm = () => {
    if (!invitee) {
      toast.error('Error: No hay datos del invitado');
      return;
    }

    // Verificar si ya asistió al día seleccionado
    const alreadyAttended = hasAttended(selectedDayNumber);
    const selectedDay = eventDays.find(d => d.dayNumber === selectedDayNumber);

    if (alreadyAttended) {
      toast.warning(`El invitado ya está marcado como presente para el ${selectedDay?.label || `Día ${selectedDayNumber}`}`);
    }

    onConfirm({
      inviteeId: invitee.id,
      dayNumber: selectedDayNumber,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  };

  const handleClose = () => {
    setSelectedDayNumber(eventDays[0]?.dayNumber || 1);
    setEmail('');
    setPhone('');
    setNotes('');
    onClose();
  };

  // Verificar si los datos están cargando
  const isLoadingData = !invitee || !event || eventDays.length === 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Confirmar Asistencia
          </DialogTitle>
          <DialogDescription>
            {isLoadingData ? 'Cargando información del invitado...' : 'Verifica y confirma la asistencia del invitado'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoadingData ? (
            /* Loading skeleton */
            <>
              <Card>
                <CardContent className="pt-4 space-y-3">
                  <div>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32 mt-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <div className="flex gap-4">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>

              <div className="space-y-3">
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-20 w-full" />
              </div>
            </>
          ) : (
            /* Contenido real */
            <>
              {/* Información del invitado */}
              <Card>
                <CardContent className="pt-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{invitee!.name}</h3>
                    <p className="text-sm text-muted-foreground">CUIL: {invitee!.cuil}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">
                        {invitee!.payment?.payerEmail || 'Sin email'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>${invitee!.payment?.amount?.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Estado actual de asistencias - DINÁMICO */}
                  <div className="flex flex-wrap gap-2">
                    {eventDays.map((day) => {
                      const attended = hasAttended(day.dayNumber);
                      return (
                        <Badge
                          key={day.dayNumber}
                          variant={attended ? "default" : "secondary"}
                        >
                          {day.label || `Día ${day.dayNumber}`}: {attended ? 'Asistió' : 'No asistió'}
                        </Badge>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Seleccionar día - DINÁMICO */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Seleccionar día de asistencia
                </Label>
                <RadioGroup
                  value={selectedDayNumber.toString()}
                  onValueChange={(value) => setSelectedDayNumber(parseInt(value))}
                  className="flex flex-wrap gap-4"
                >
                  {eventDays.map((day) => (
                    <div key={day.dayNumber} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={day.dayNumber.toString()}
                        id={`day-${day.dayNumber}`}
                      />
                      <Label htmlFor={`day-${day.dayNumber}`} className="cursor-pointer">
                        {day.label || `Día ${day.dayNumber}`}
                        {day.date && (
                          <span className="text-xs text-muted-foreground ml-1">
                            ({new Date(day.date).toLocaleDateString('es-AR')})
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Campos opcionales para actualizar datos */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Actualizar datos del invitado (opcional)</Label>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4" />
                    Email personal del invitado
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4" />
                    Teléfono personal del invitado
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+54 9 11 1234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Campo de notas */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Notas (opcional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Agregar notas sobre la asistencia..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading || isLoadingData}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || isLoadingData}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? 'Guardando...' : isLoadingData ? 'Cargando...' : 'Confirmar Asistencia'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}