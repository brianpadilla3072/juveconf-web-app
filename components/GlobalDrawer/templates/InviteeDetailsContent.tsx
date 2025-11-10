'use client';

import { useState, useEffect } from 'react';
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
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
  Package,
  Gift,
  Info,
  Loader2
} from 'lucide-react';
import { Invitee, ParsedMetadata } from '@/entities/Invitee';
import { Event } from '@/entities/Event';
import { useInviteeComboInfo } from '@/hooks/invitees/useInviteeComboInfo';

interface InviteeDetailsContentProps {
  invitee: Invitee;
  onEdit?: (invitee: Invitee) => void;
  onDelete?: (id: string) => void;
  event?: Event | null;
  onAttendanceChange?: (inviteeId: string, dayNumber: number, attended: boolean) => void;
}

export function InviteeDetailsContent({
  invitee,
  onEdit,
  onDelete,
  event,
  onAttendanceChange
}: InviteeDetailsContentProps) {
  const [metadata, setMetadata] = useState<ParsedMetadata | null>(null);
  
  // Obtener información del combo
  const { comboInfo, loading: comboLoading, error: comboError } = useInviteeComboInfo(invitee.id);

  useEffect(() => {
    // Usar parsedMetadata si está disponible, si no parsear manualmente
    if (invitee?.parsedMetadata) {
      setMetadata(invitee.parsedMetadata);
    } else if (invitee?.metadata) {
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

  // Combinar metadata con attendeeInfo del combo (attendeeInfo tiene prioridad)
  const combinedMetadata = {
    email: comboInfo?.attendeeInfo?.email || metadata?.email || invitee.email,
    phone: comboInfo?.attendeeInfo?.phone || metadata?.phone || invitee.phone,
    birthdate: comboInfo?.attendeeInfo?.birthdate || metadata?.birthdate,
    city: comboInfo?.attendeeInfo?.city || metadata?.city,
    church: comboInfo?.attendeeInfo?.church || metadata?.church,
    merchandiseSizes: comboInfo?.attendeeInfo?.merchandiseSizes || metadata?.merchandiseSizes,
  };

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

  const eventDays = event?.eventDays?.days || [];

  return (
    <>
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
        {(onEdit || onDelete) && (
          <div className="flex gap-2 pt-2">
            {onEdit && (
              <Button
                onClick={() => onEdit(invitee)}
                className="flex-1 bg-violet-600 hover:bg-violet-700"
                size="sm"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
            {onDelete && (
              <Button
                onClick={() => onDelete(invitee.id)}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            )}
          </div>
        )}
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
                  {combinedMetadata.email || '-'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-slate-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Teléfono</p>
                <p className="text-sm text-slate-900 font-medium">
                  {combinedMetadata.phone || '-'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Metadata Adicional */}
        {(combinedMetadata.birthdate || combinedMetadata.city || combinedMetadata.church ||
          (combinedMetadata.merchandiseSizes && Object.keys(combinedMetadata.merchandiseSizes).length > 0)) && (
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
            <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
              <Package className="h-5 w-5 text-violet-600" />
              Información Adicional
            </h3>
            <div className="space-y-3">
              {combinedMetadata.birthdate && (
                <>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-slate-500 mt-1" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 font-medium">Fecha de Nacimiento</p>
                      <p className="text-sm text-slate-900 font-medium">
                        {new Date(combinedMetadata.birthdate).toLocaleDateString('es-AR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 text-slate-500 mt-1" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 font-medium">Edad</p>
                      <p className="text-sm text-slate-900 font-medium">
                        {calculateAge(combinedMetadata.birthdate)} años
                      </p>
                    </div>
                  </div>
                </>
              )}
              {combinedMetadata.city && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-slate-500 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 font-medium">Localidad</p>
                    <p className="text-sm text-slate-900 font-medium">{combinedMetadata.city}</p>
                  </div>
                </div>
              )}
              {combinedMetadata.church && (
                <div className="flex items-start gap-3">
                  <Church className="h-4 w-4 text-slate-500 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 font-medium">Iglesia</p>
                    <p className="text-sm text-slate-900 font-medium">{combinedMetadata.church}</p>
                  </div>
                </div>
              )}
              {combinedMetadata.merchandiseSizes && Object.keys(combinedMetadata.merchandiseSizes).length > 0 && (
                <div className="flex items-start gap-3">
                  <Package className="h-4 w-4 text-slate-500 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 font-medium">Merchandising</p>
                    <div className="space-y-1">
                      {Object.entries(combinedMetadata.merchandiseSizes).map(([type, size]) => (
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

        {/* Información del Combo */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
          <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
            <Gift className="h-5 w-5 text-violet-600" />
            Información del Combo
          </h3>
          
          {comboLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-violet-600" />
              <span className="ml-2 text-sm text-slate-600">Cargando información del combo...</span>
            </div>
          ) : comboError ? (
            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <Info className="h-4 w-4 text-red-500" />
              <div className="flex-1">
                <p className="text-sm text-red-700 font-medium">Error al cargar</p>
                <p className="text-xs text-red-600">{comboError}</p>
              </div>
            </div>
          ) : !comboInfo?.hasCombo ? (
            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <Package className="h-4 w-4 text-slate-500" />
              <div className="flex-1">
                <p className="text-sm text-slate-700 font-medium">Sin combo asociado</p>
                <p className="text-xs text-slate-600">{comboInfo?.message || 'No se encontró información del combo'}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Nombre del combo */}
              <div className="flex items-start gap-3">
                <Package className="h-4 w-4 text-slate-500 mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 font-medium">Combo</p>
                  <p className="text-sm text-slate-900 font-bold">{comboInfo.name}</p>
                  {comboInfo.description && (
                    <p className="text-xs text-slate-600 mt-1">{comboInfo.description}</p>
                  )}
                </div>
              </div>

              {/* Precio */}
              <div className="flex items-start gap-3">
                <DollarSign className="h-4 w-4 text-slate-500 mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 font-medium">Precio</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-slate-900 font-bold">
                      {comboInfo.isFree ? 'GRATUITO' : `$${comboInfo.price?.toLocaleString()}`}
                    </p>
                    {comboInfo.snapshotInfo?.appliedPrice && comboInfo.snapshotInfo.appliedPrice !== comboInfo.price && (
                      <Badge variant="secondary" className="text-xs">
                        Precio aplicado: ${comboInfo.snapshotInfo.appliedPrice.toLocaleString()}
                      </Badge>
                    )}
                  </div>
                  {comboInfo.snapshotInfo?.preSaleInfo && (
                    <p className="text-xs text-green-600 mt-1">
                      Preventa: {comboInfo.snapshotInfo.preSaleInfo.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Personas incluidas */}
              {comboInfo.personsIncluded && (
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 text-slate-500 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 font-medium">Personas Incluidas</p>
                    <p className="text-sm text-slate-900 font-medium">{comboInfo.personsIncluded}</p>
                  </div>
                </div>
              )}

              {/* Beneficios */}
              {comboInfo.benefits && comboInfo.benefits.length > 0 && (
                <div className="flex items-start gap-3">
                  <Package className="h-4 w-4 text-slate-500 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 font-medium">Beneficios Incluidos</p>
                    <ul className="text-xs text-slate-700 mt-1 space-y-1">
                      {comboInfo.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-violet-600 font-bold">•</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Merchandising */}
              {comboInfo.merchandise?.enabled && comboInfo.merchandise.allMerchandise?.length > 0 && (
                <div className="flex items-start gap-3">
                  <Gift className="h-4 w-4 text-slate-500 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 font-medium">Merchandising Incluido</p>
                    <div className="space-y-1 mt-1">
                      {comboInfo.merchandise.allMerchandise.map((item, index) => (
                        <div key={index} className="text-xs text-slate-700">
                          <p className="font-medium text-violet-700">{item.label}</p>
                          <p className="text-slate-600">Tallas disponibles: {item.sizes.join(', ')}</p>
                          {/* Mostrar talla seleccionada desde merchandise.selectedSizes o attendeeInfo */}
                          {(comboInfo.merchandise?.selectedSizes?.[item.type] ||
                            combinedMetadata.merchandiseSizes?.[item.type]) && (
                            <p className="text-violet-600 font-bold">
                              Talla seleccionada: {comboInfo.merchandise?.selectedSizes?.[item.type] ||
                                                   combinedMetadata.merchandiseSizes?.[item.type]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
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
                      disabled={!onAttendanceChange}
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
    </>
  );
}
