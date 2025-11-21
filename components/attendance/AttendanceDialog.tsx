'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { InviteeData } from '@/hooks/attendance/useAttendance';

export interface EventDay {
  dayNumber: number;
  label?: string;
  date?: string;
}

interface AttendanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invitee: InviteeData | null;
  eventDays: EventDay[];
  onConfirm: (data: { inviteeId: string; days: { dayNumber: number; attended: boolean }[]; notes?: string }) => void;
  isLoading?: boolean;
}

export default function AttendanceDialog({
  isOpen,
  onClose,
  invitee,
  eventDays,
  onConfirm,
  isLoading = false
}: AttendanceDialogProps) {
  const [dayStates, setDayStates] = useState<Record<number, boolean>>({});
  const [notes, setNotes] = useState('');

  const hasAttended = (dayNumber: number): boolean => {
    return invitee?.attendance?.days?.[dayNumber.toString()]?.attended || false;
  };

  useEffect(() => {
    if (invitee && isOpen && eventDays.length > 0) {
      setNotes('');
      // Inicializar estados de días basándose en asistencia actual
      const initialStates: Record<number, boolean> = {};
      eventDays.forEach(day => {
        initialStates[day.dayNumber] = hasAttended(day.dayNumber);
      });
      setDayStates(initialStates);
    }
  }, [invitee, isOpen, eventDays]);

  const handleConfirm = () => {
    if (!invitee) {
      toast.error('Error: No hay datos del invitado');
      return;
    }

    const days = Object.entries(dayStates).map(([dayNum, attended]) => ({
      dayNumber: parseInt(dayNum),
      attended,
    }));

    onConfirm({
      inviteeId: invitee.id,
      days,
      notes: notes.trim() || undefined,
    });
  };

  const toggleDay = (dayNumber: number) => {
    setDayStates(prev => ({
      ...prev,
      [dayNumber]: !prev[dayNumber]
    }));
  };

  if (!invitee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Tomar Asistencia
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Información del Invitado */}
          <Card className="p-4 bg-slate-50">
            <h3 className="font-semibold text-lg">{invitee.name}</h3>
            <p className="text-sm text-muted-foreground">CUIL: {invitee.cuil}</p>
          </Card>

          {/* Lista de Días con Checkboxes */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Días del Evento</Label>
            <div className="space-y-2">
              {eventDays.map((day) => (
                <div
                  key={day.dayNumber}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Checkbox
                      id={`day-${day.dayNumber}`}
                      checked={dayStates[day.dayNumber] || false}
                      onCheckedChange={() => toggleDay(day.dayNumber)}
                    />
                    <Label
                      htmlFor={`day-${day.dayNumber}`}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{day.label || `Día ${day.dayNumber}`}</span>
                        {day.date && (
                          <span className="text-sm text-muted-foreground">
                            {new Date(day.date).toLocaleDateString('es-AR')}
                          </span>
                        )}
                      </div>
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notas Opcionales */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas (Opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Agregar observaciones..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
