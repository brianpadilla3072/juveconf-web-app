'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, DollarSign, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';

interface InviteeData {
  id: string;
  name: string;
  cuil: string;
  email?: string;
  phone?: string;
  attendedDay1: boolean;
  attendedDay2: boolean;
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
  onConfirm: (data: {
    inviteeId: string;
    day: 'day1' | 'day2';
    email?: string;
    phone?: string;
  }) => void;
  isLoading?: boolean;
}

export default function AttendanceModal({ 
  isOpen, 
  onClose, 
  invitee, 
  onConfirm, 
  isLoading = false 
}: AttendanceModalProps) {
  const [selectedDay, setSelectedDay] = useState<'day1' | 'day2'>('day1');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Resetear formulario cuando se abre el modal con nuevos datos
  useEffect(() => {
    if (invitee && isOpen) {
      setEmail(invitee.email || '');
      setPhone(invitee.phone || '');
      setSelectedDay('day1'); // Por defecto día 1
    }
  }, [invitee, isOpen]);

  const handleConfirm = () => {
    if (!invitee) {
      toast.error('Error: No hay datos del invitado');
      return;
    }

    // Verificar si ya asistió al día seleccionado
    const alreadyAttended = selectedDay === 'day1' 
      ? invitee.attendedDay1 
      : invitee.attendedDay2;

    if (alreadyAttended) {
      toast.warning(`El invitado ya está marcado como presente para el ${selectedDay === 'day1' ? 'Día 1' : 'Día 2'}`);
    }

    onConfirm({
      inviteeId: invitee.id,
      day: selectedDay,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
    });
  };

  const handleClose = () => {
    setSelectedDay('day1');
    setEmail('');
    setPhone('');
    onClose();
  };

  if (!invitee) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Confirmar Asistencia
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información del invitado */}
          <Card>
            <CardContent className="pt-4 space-y-3">
              <div>
                <h3 className="font-semibold text-lg">{invitee.name}</h3>
                <p className="text-sm text-muted-foreground">CUIL: {invitee.cuil}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">
                    {invitee.payment?.payerEmail || 'Sin email'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>${invitee.payment?.amount?.toLocaleString()}</span>
                </div>
              </div>

              {/* Estado actual de asistencias */}
              <div className="flex gap-2">
                <Badge variant={invitee.attendedDay1 ? "default" : "secondary"}>
                  Día 1: {invitee.attendedDay1 ? 'Asistió' : 'No asistió'}
                </Badge>
                <Badge variant={invitee.attendedDay2 ? "default" : "secondary"}>
                  Día 2: {invitee.attendedDay2 ? 'Asistió' : 'No asistió'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Seleccionar día */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Seleccionar día de asistencia
            </Label>
            <RadioGroup 
              value={selectedDay} 
              onValueChange={(value) => setSelectedDay(value as 'day1' | 'day2')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="day1" id="day1" />
                <Label htmlFor="day1" className="cursor-pointer">Día 1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="day2" id="day2" />
                <Label htmlFor="day2" className="cursor-pointer">Día 2</Label>
              </div>
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
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? 'Guardando...' : 'Confirmar Asistencia'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}