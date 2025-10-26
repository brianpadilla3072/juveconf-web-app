'use client';

import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Package,
  DollarSign,
  Users,
  Calendar,
  Tag,
  TrendingDown,
  List
} from 'lucide-react';
import { Combo } from '@/entities/Combo';

interface ComboDetailsContentProps {
  combo: Combo;
}

export function ComboDetailsContent({ combo }: ComboDetailsContentProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  return (
    <>
      <SheetHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-violet-100 rounded-full">
            <Package className="h-6 w-6 text-violet-600" />
          </div>
          <div className="flex-1">
            <SheetTitle className="text-2xl font-bold text-violet-900">
              {combo.name}
            </SheetTitle>
            <SheetDescription className="text-violet-600">
              Evento: {combo.event?.topic} {combo.event?.year}
            </SheetDescription>
          </div>
        </div>

        {/* Badges de Estado */}
        <div className="flex gap-2 pt-2 flex-wrap">
          <Badge variant={combo.isActive ? 'default' : 'secondary'} className="text-sm">
            {combo.isActive ? 'Activo' : 'Inactivo'}
          </Badge>
          <Badge variant={combo.isPublished ? 'default' : 'outline'} className="text-sm">
            {combo.isPublished ? 'Publicado' : 'No Publicado'}
          </Badge>
          {combo.isFree && (
            <Badge variant="secondary" className="text-sm bg-green-100 text-green-800">
              Gratis
            </Badge>
          )}
        </div>
      </SheetHeader>

      <Separator className="my-4" />

      <div className="space-y-6">
        {/* Información de Precios */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
          <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-violet-600" />
            Información de Precios
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <DollarSign className="h-4 w-4 text-slate-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Precio Base</p>
                <p className="text-2xl text-slate-900 font-bold">
                  {formatPrice(combo.price)}
                </p>
              </div>
            </div>

            {combo.currentPrice && (
              <>
                <Separator />
                <div className="flex items-start gap-3">
                  <Tag className="h-4 w-4 text-slate-500 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 font-medium">Precio Actual</p>
                    <p className="text-2xl text-green-600 font-bold">
                      {formatPrice(combo.currentPrice.price)}
                    </p>
                    {combo.currentPrice.isPreSale && (
                      <Badge variant="secondary" className="mt-1">
                        Preventa: {combo.currentPrice.preSaleName}
                      </Badge>
                    )}
                  </div>
                </div>
                {combo.currentPrice.discount > 0 && (
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                    <TrendingDown className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700 font-medium">
                      Descuento: {combo.currentPrice.discount}%
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Información de Capacidad */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
          <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
            <Users className="h-5 w-5 text-violet-600" />
            Capacidad
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Users className="h-4 w-4 text-slate-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Personas Incluidas</p>
                <p className="text-sm text-slate-900 font-bold">
                  {combo.personsIncluded} persona{combo.personsIncluded !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            {combo.maxPersons && (
              <div className="flex items-start gap-3">
                <Users className="h-4 w-4 text-slate-500 mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 font-medium">Máximo de Personas</p>
                  <p className="text-sm text-slate-900 font-bold">
                    {combo.maxPersons} persona{combo.maxPersons !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Descripción */}
        {combo.description && (
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
            <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
              <List className="h-5 w-5 text-violet-600" />
              Descripción
            </h3>
            <div
              className="text-sm text-slate-700 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: combo.description }}
            />
          </div>
        )}

        {/* Precios de Preventas */}
        {combo.preSalePrices && combo.preSalePrices.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
            <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
              <Tag className="h-5 w-5 text-violet-600" />
              Precios en Preventas
            </h3>
            <div className="space-y-2">
              {combo.preSalePrices.map((preSalePrice) => (
                <div
                  key={preSalePrice.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      {preSalePrice.preSale.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(preSalePrice.preSale.startDate).toLocaleDateString('es-AR')} -{' '}
                      {new Date(preSalePrice.preSale.endDate).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      {formatPrice(preSalePrice.price)}
                    </p>
                    <p className="text-xs text-slate-500">
                      Ahorro: {formatPrice(combo.price - preSalePrice.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Información del Evento */}
        {combo.event && (
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
            <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-violet-600" />
              Evento Asociado
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-slate-500 mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 font-medium">Tema</p>
                  <p className="text-sm text-slate-900 font-medium">
                    {combo.event.topic} - {combo.event.year}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-4 w-4 text-slate-500 mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 font-medium">Capacidad del Evento</p>
                  <p className="text-sm text-slate-900 font-medium">
                    {combo.event.capacity} personas
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-slate-500 mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 font-medium">Inicio de Ventas</p>
                  <p className="text-sm text-slate-900 font-medium">
                    {new Date(combo.event.salesStartDate).toLocaleDateString('es-AR')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Metadata adicional */}
        {combo.displayOrder !== undefined && (
          <div className="bg-slate-100/50 rounded-lg p-4 border border-slate-200">
            <h4 className="text-xs font-semibold text-slate-600 mb-2">Información Adicional</h4>
            <div className="space-y-2 text-xs text-slate-500">
              <div>
                <span className="font-bold">Orden de Visualización:</span> {combo.displayOrder}
              </div>
            </div>
          </div>
        )}

        {/* IDs de Referencia */}
        <div className="bg-slate-100/50 rounded-lg p-4 border border-slate-200">
          <h4 className="text-xs font-semibold text-slate-600 mb-2">IDs de Referencia</h4>
          <div className="space-y-2 text-xs font-mono text-slate-500">
            <div>
              <span className="font-bold">Combo ID:</span> {combo.id}
            </div>
            <div>
              <span className="font-bold">Event ID:</span> {combo.eventId}
            </div>
            <div>
              <span className="font-bold">Creado:</span>{' '}
              {new Date(combo.createdAt).toLocaleString('es-AR')}
            </div>
            <div>
              <span className="font-bold">Actualizado:</span>{' '}
              {new Date(combo.updatedAt).toLocaleString('es-AR')}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
