'use client';

import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  MapPin,
  Church,
  Edit,
  Trash2,
  DollarSign,
  Package
} from 'lucide-react';
import { Invitee } from '@/entities/Invitee';
import { Event } from '@/entities/Event';

interface InviteeDetailsDrawerProps {
  invitee: Invitee | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (invitee: Invitee) => void;
  onDelete: (id: string) => void;
  event?: Event | null;
  onAttendanceChange?: (inviteeId: string, dayNumber: number, attended: boolean) => void;
}

interface ParsedMetadata {
  email?: string;
  phone?: string;
  birthdate?: string;
  city?: string;
  church?: string;
  merchandiseSizes?: { [type: string]: string };
}

export default function InviteeDetailsDrawer({
  invitee,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  event,
  onAttendanceChange
}: InviteeDetailsDrawerProps) {
  const [metadata, setMetadata] = useState<ParsedMetadata | null>(null);

  useEffect(() => {
    if (invitee?.metadata) {
      try {
        const parsed = JSON.parse(invitee.metadata);
        setMetadata(parsed);
      } catch (error) {
        console.error('Error parsing metadata:', error);
        setMetadata(null);
      }
    } else {
      setMetadata(null);
    }
  }, [invitee]);

  const handleAttendanceToggle = (dayNumber: number, currentValue: boolean) => {
    if (invitee && onAttendanceChange) {
      onAttendanceChange(invitee.id, dayNumber, !currentValue);
    }
  };

  const hasAttended = (dayNumber: number): boolean => {
    return invitee?.attendance?.days?.[dayNumber.toString()]?.attended || false;
  };

  const calculateAge = (birthdate: string): number => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  if (!invitee) return null;

  const eventDays = event?.eventDays?.days || [];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto bg-gradient-to-br from-slate-50 to-violet-50/30">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-violet-100 rounded-full">
              <User className="h-6 w-6 text-violet-600" />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-2xl font-bold text-violet-900">
                {invitee.name}
              </SheetTitle>
              <SheetDescription className="text-violet-600 font-mono">
                CUIL: {invitee.cuil}
              </SheetDescription>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => onEdit(invitee)}
              className="flex-1 bg-violet-600 hover:bg-violet-700"
              size="sm"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button
              onClick={() => {
                onDelete(invitee.id);
                onClose();
              }}
              variant="destructive"
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </SheetHeader>

        <Separator className="my-4" />

        <div className="space-y-6">
          {/* Información de Contacto */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
            <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
              <Mail className="h-5 w-5 text-violet-600" />
              Información de Contacto
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-slate-500 mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 font-medium">Email</p>
                  <p className="text-sm text-slate-900 font-medium break-all">
                    {invitee.email || metadata?.email || '-'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-slate-500 mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 font-medium">Teléfono</p>
                  <p className="text-sm text-slate-900 font-medium">
                    {invitee.phone || metadata?.phone || '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata Adicional */}
          {metadata && (metadata.birthdate || metadata.city || metadata.church) && (
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
              <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
                <Package className="h-5 w-5 text-violet-600" />
                Información Adicional
              </h3>
              <div className="space-y-3">
                {metadata.birthdate && (
                  <>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-4 w-4 text-slate-500 mt-1" />
                      <div className="flex-1">
                        <p className="text-xs text-slate-500 font-medium">Fecha de Nacimiento</p>
                        <p className="text-sm text-slate-900 font-medium">
                          {new Date(metadata.birthdate).toLocaleDateString('es-AR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 text-slate-500 mt-1" />
                      <div className="flex-1">
                        <p className="text-xs text-slate-500 font-medium">Edad</p>
                        <p className="text-sm text-slate-900 font-medium">
                          {calculateAge(metadata.birthdate)} años
                        </p>
                      </div>
                    </div>
                  </>
                )}
                {metadata.city && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-slate-500 mt-1" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 font-medium">Localidad</p>
                      <p className="text-sm text-slate-900 font-medium">{metadata.city}</p>
                    </div>
                  </div>
                )}
                {metadata.church && (
                  <div className="flex items-start gap-3">
                    <Church className="h-4 w-4 text-slate-500 mt-1" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 font-medium">Iglesia</p>
                      <p className="text-sm text-slate-900 font-medium">{metadata.church}</p>
                    </div>
                  </div>
                )}
                {metadata.merchandiseSizes && Object.keys(metadata.merchandiseSizes).length > 0 && (
                  <div className="flex items-start gap-3">
                    <Package className="h-4 w-4 text-slate-500 mt-1" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 font-medium">Merchandising</p>
                      <div className="space-y-1">
                        {Object.entries(metadata.merchandiseSizes).map(([type, size]) => (
                          <p key={type} className="text-sm text-slate-900 font-medium">
                            {type.charAt(0).toUpperCase() + type.slice(1)}: <span className="text-violet-600 font-bold">{size}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Información de Pago */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
            <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-violet-600" />
              Información de Pago
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-slate-500 mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 font-medium">Email del Pagador</p>
                  <p className="text-sm text-slate-900 font-medium break-all">
                    {invitee.payment?.payerEmail || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="h-4 w-4 text-slate-500 mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 font-medium">Monto</p>
                  <p className="text-sm text-slate-900 font-bold">
                    ${invitee.payment?.amount?.toLocaleString() || '0'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="h-4 w-4 text-slate-500 mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 font-medium">Estado de Orden</p>
                  <Badge
                    variant={
                      invitee.order?.status === 'PAID'
                        ? 'default'
                        : invitee.order?.status === 'PENDING'
                        ? 'secondary'
                        : 'destructive'
                    }
                  >
                    {invitee.order?.status || 'Sin orden'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Asistencia */}
          {eventDays.length > 0 && (
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
              <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-violet-600" />
                Asistencia
              </h3>
              <div className="space-y-3">
                {eventDays.map((day) => (
                  <div
                    key={day.dayNumber}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={hasAttended(day.dayNumber)}
                        onCheckedChange={() => handleAttendanceToggle(day.dayNumber, hasAttended(day.dayNumber))}
                      />
                      <span className="text-sm font-medium text-slate-900">
                        {day.label || `Día ${day.dayNumber}`}
                      </span>
                    </div>
                    {hasAttended(day.dayNumber) && (
                      <Badge variant="default" className="bg-green-600">
                        ✓ Asistió
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* IDs de Referencia */}
          <div className="bg-slate-100/50 rounded-lg p-4 border border-slate-200">
            <h4 className="text-xs font-semibold text-slate-600 mb-2">IDs de Referencia</h4>
            <div className="space-y-2 text-xs font-mono text-slate-500">
              <div>
                <span className="font-bold">Invitee ID:</span> {invitee.id}
              </div>
              {invitee.orderId && (
                <div>
                  <span className="font-bold">Order ID:</span> {invitee.orderId}
                </div>
              )}
              {invitee.paymentId && (
                <div>
                  <span className="font-bold">Payment ID:</span> {invitee.paymentId}
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
