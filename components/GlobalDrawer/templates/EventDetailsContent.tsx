'use client';

import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  Users,
  MapPin,
  FileText,
  Package,
  Tag,
  ExternalLink
} from 'lucide-react';
import { Event } from '@/entities/Event';
import { Button } from '@/components/ui/button';

interface EventDetailsContentProps {
  event: Event;
}

export function EventDetailsContent({ event }: EventDetailsContentProps) {
  const getPublishedCombosUrl = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3072';
    return `${apiUrl}/combos/event/${event.id}/published`;
  };

  const isEventFinished = () => {
    if (!event.eventEndDate) return false;
    return new Date(event.eventEndDate) < new Date();
  };

  const isEventActive = () => {
    if (!event.eventStartDate) return false;
    const now = new Date();
    const start = new Date(event.eventStartDate);
    const end = event.eventEndDate ? new Date(event.eventEndDate) : null;
    return now >= start && (!end || now <= end);
  };

  return (
    <>
      <SheetHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-violet-100 rounded-full">
            <Calendar className="h-6 w-6 text-violet-600" />
          </div>
          <div className="flex-1">
            <SheetTitle className="text-2xl font-bold text-violet-900">
              {event.topic}
            </SheetTitle>
            <SheetDescription className="text-violet-600 text-lg font-semibold">
              Año {event.year}
            </SheetDescription>
          </div>
        </div>

        {/* Badges de Estado */}
        <div className="flex gap-2 pt-2 flex-wrap">
          <Badge
            variant={event.isActive ? 'default' : 'secondary'}
            className="text-sm"
          >
            {event.isActive ? 'Activo' : 'Inactivo'}
          </Badge>
          {isEventActive() && (
            <Badge variant="default" className="text-sm bg-green-600">
              En Curso
            </Badge>
          )}
          {isEventFinished() && (
            <Badge variant="secondary" className="text-sm">
              Finalizado
            </Badge>
          )}
        </div>
      </SheetHeader>

      <Separator className="my-4" />

      <div className="space-y-6">
        {/* Información General */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
          <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
            <FileText className="h-5 w-5 text-violet-600" />
            Información General
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Users className="h-4 w-4 text-slate-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Capacidad</p>
                <p className="text-sm text-slate-900 font-bold">
                  {event.capacity} personas
                </p>
              </div>
            </div>

            {event.location && (
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-slate-500 mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 font-medium">Ubicación</p>
                  <p className="text-sm text-slate-900 font-medium">
                    {event.location}
                  </p>
                </div>
              </div>
            )}

            {event.description && (
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-slate-500 mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 font-medium">Descripción</p>
                  <p className="text-sm text-slate-700">
                    {event.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fechas de Ventas */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
          <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
            <Tag className="h-5 w-5 text-violet-600" />
            Período de Ventas
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-slate-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Inicio de Ventas</p>
                <p className="text-sm text-slate-900 font-medium">
                  {new Date(event.salesStartDate).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {event.salesEndDate && (
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-slate-500 mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 font-medium">Fin de Ventas</p>
                  <p className="text-sm text-slate-900 font-medium">
                    {new Date(event.salesEndDate).toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fechas del Evento */}
        {(event.eventStartDate || event.eventEndDate) && (
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
            <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-violet-600" />
              Fechas del Evento
            </h3>
            <div className="space-y-3">
              {event.eventStartDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-slate-500 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 font-medium">Inicio del Evento</p>
                    <p className="text-sm text-slate-900 font-medium">
                      {new Date(event.eventStartDate).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}

              {event.eventEndDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-slate-500 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 font-medium">Fin del Evento</p>
                    <p className="text-sm text-slate-900 font-medium">
                      {new Date(event.eventEndDate).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Días del Evento */}
        {event.eventDays && event.eventDays.days.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
            <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-violet-600" />
              Días del Evento ({event.eventDays.totalDays})
            </h3>
            <div className="space-y-2">
              {event.eventDays.days.map((day) => (
                <div
                  key={day.dayNumber}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-violet-100 rounded-full">
                      <span className="text-sm font-bold text-violet-600">
                        {day.dayNumber}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {day.label || `Día ${day.dayNumber}`}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(day.date).toLocaleDateString('es-AR', {
                          weekday: 'long',
                          day: '2-digit',
                          month: 'long'
                        })}
                      </p>
                    </div>
                  </div>
                  {day.type && (
                    <Badge variant="secondary" className="text-xs">
                      {day.type}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Combos Asociados */}
        {event.combos && event.combos.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
            <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
              <Package className="h-5 w-5 text-violet-600" />
              Combos Disponibles ({event.combos.length})
            </h3>
            <div className="space-y-2">
              {event.combos.map((combo) => (
                <div
                  key={combo.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{combo.name}</p>
                    <p className="text-xs text-slate-500">
                      ${combo.price.toLocaleString('es-AR')}
                    </p>
                  </div>
                  <Badge variant={combo.isActive ? 'default' : 'secondary'} className="text-xs">
                    {combo.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              ))}
            </div>

            {/* URL de Combos Publicados */}
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 font-medium mb-2">
                URL de Combos Publicados
              </p>
              <div className="flex gap-2">
                <code className="flex-1 text-xs bg-slate-100 p-2 rounded border border-slate-200 text-slate-700 overflow-x-auto">
                  {getPublishedCombosUrl()}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(getPublishedCombosUrl());
                  }}
                  className="shrink-0"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Preventas Asociadas */}
        {event.preSales && event.preSales.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
            <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
              <Tag className="h-5 w-5 text-violet-600" />
              Preventas ({event.preSales.length})
            </h3>
            <div className="space-y-2">
              {event.preSales.map((preSale) => (
                <div
                  key={preSale.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{preSale.name}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(preSale.startDate).toLocaleDateString('es-AR')} -{' '}
                      {new Date(preSale.endDate).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  <Badge variant={preSale.isActive ? 'default' : 'secondary'} className="text-xs">
                    {preSale.isActive ? 'Activa' : 'Inactiva'}
                  </Badge>
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
              <span className="font-bold">Event ID:</span> {event.id}
            </div>
            <div>
              <span className="font-bold">Creado:</span>{' '}
              {new Date(event.createdAt).toLocaleString('es-AR')}
            </div>
            <div>
              <span className="font-bold">Actualizado:</span>{' '}
              {new Date(event.updatedAt).toLocaleString('es-AR')}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
