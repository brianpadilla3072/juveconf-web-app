'use client';

import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Tag,
  Calendar,
  DollarSign,
  Package,
  TrendingDown,
  FileText
} from 'lucide-react';
import { PreSale } from '@/entities/PreSale';

interface PreSaleDetailsContentProps {
  preSale: PreSale;
}

export function PreSaleDetailsContent({ preSale }: PreSaleDetailsContentProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  const calculateDiscount = (originalPrice: number, salePrice: number) => {
    return ((originalPrice - salePrice) / originalPrice * 100).toFixed(0);
  };

  const isActive = () => {
    const now = new Date();
    const start = new Date(preSale.startDate);
    const end = new Date(preSale.endDate);
    return now >= start && now <= end && preSale.isActive;
  };

  return (
    <>
      <SheetHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-violet-100 rounded-full">
            <Tag className="h-6 w-6 text-violet-600" />
          </div>
          <div className="flex-1">
            <SheetTitle className="text-2xl font-bold text-violet-900">
              {preSale.name}
            </SheetTitle>
            <SheetDescription className="text-violet-600">
              Preventa de Combos
            </SheetDescription>
          </div>
        </div>

        {/* Badges de Estado */}
        <div className="flex gap-2 pt-2 flex-wrap">
          <Badge variant={preSale.isActive ? 'default' : 'secondary'} className="text-sm">
            {preSale.isActive ? 'Activa' : 'Inactiva'}
          </Badge>
          {isActive() && (
            <Badge variant="default" className="text-sm bg-green-600">
              En Curso
            </Badge>
          )}
        </div>
      </SheetHeader>

      <Separator className="my-4" />

      <div className="space-y-6">
        {/* Información General */}
        {preSale.description && (
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
            <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-violet-600" />
              Descripción
            </h3>
            <p className="text-sm text-slate-700">
              {preSale.description}
            </p>
          </div>
        )}

        {/* Fechas de la Preventa */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
          <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-violet-600" />
            Período de Preventa
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-slate-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Inicio</p>
                <p className="text-sm text-slate-900 font-medium">
                  {new Date(preSale.startDate).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-slate-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Fin</p>
                <p className="text-sm text-slate-900 font-medium">
                  {new Date(preSale.endDate).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            {/* Duración */}
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-slate-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Duración</p>
                <p className="text-sm text-slate-900 font-medium">
                  {Math.ceil(
                    (new Date(preSale.endDate).getTime() - new Date(preSale.startDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                  )} días
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Combos con Precios de Preventa */}
        {preSale.comboPrices && preSale.comboPrices.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
            <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
              <Package className="h-5 w-5 text-violet-600" />
              Combos en Preventa ({preSale.comboPrices.length})
            </h3>
            <div className="space-y-3">
              {preSale.comboPrices.map((comboPrice) => (
                <div
                  key={comboPrice.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="h-4 w-4 text-slate-600" />
                      <p className="text-sm font-semibold text-slate-900">
                        {comboPrice.combo?.name || 'Combo sin nombre'}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                      {/* Precio Original */}
                      <div>
                        <p className="text-xs text-slate-500">Precio Original</p>
                        <p className="text-sm text-slate-600 line-through">
                          {comboPrice.combo && formatPrice(comboPrice.combo.price)}
                        </p>
                      </div>

                      {/* Precio de Preventa */}
                      <div>
                        <p className="text-xs text-slate-500">Precio Preventa</p>
                        <p className="text-lg font-bold text-green-600">
                          {formatPrice(comboPrice.price)}
                        </p>
                      </div>

                      {/* Descuento */}
                      {comboPrice.combo && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-lg">
                          <TrendingDown className="h-3 w-3 text-green-700" />
                          <span className="text-xs font-bold text-green-700">
                            -{calculateDiscount(comboPrice.combo.price, comboPrice.price)}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Ahorro */}
                    {comboPrice.combo && (
                      <p className="text-xs text-green-600 font-medium mt-1">
                        Ahorras: {formatPrice(comboPrice.combo.price - comboPrice.price)}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Resumen Total */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between p-3 bg-violet-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-violet-900">Ahorro Total Máximo</p>
                    <p className="text-xs text-violet-600">
                      Si compras todos los combos en preventa
                    </p>
                  </div>
                  <p className="text-xl font-bold text-violet-600">
                    {formatPrice(
                      preSale.comboPrices.reduce((total, cp) => {
                        if (cp.combo) {
                          return total + (cp.combo.price - cp.price);
                        }
                        return total;
                      }, 0)
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Estadísticas */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
          <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-violet-600" />
            Estadísticas
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 font-medium">Combos en Preventa</p>
              <p className="text-2xl font-bold text-slate-900">
                {preSale.comboPrices?.length || 0}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 font-medium">Descuento Promedio</p>
              <p className="text-2xl font-bold text-green-600">
                {preSale.comboPrices && preSale.comboPrices.length > 0
                  ? Math.round(
                      preSale.comboPrices.reduce((sum, cp) => {
                        if (cp.combo) {
                          return sum + parseFloat(calculateDiscount(cp.combo.price, cp.price));
                        }
                        return sum;
                      }, 0) / preSale.comboPrices.length
                    )
                  : 0}%
              </p>
            </div>
          </div>
        </div>

        {/* IDs de Referencia */}
        <div className="bg-slate-100/50 rounded-lg p-4 border border-slate-200">
          <h4 className="text-xs font-semibold text-slate-600 mb-2">IDs de Referencia</h4>
          <div className="space-y-2 text-xs font-mono text-slate-500">
            <div>
              <span className="font-bold">PreSale ID:</span> {preSale.id}
            </div>
            <div>
              <span className="font-bold">Event ID:</span> {preSale.eventId}
            </div>
            <div>
              <span className="font-bold">Creado:</span>{' '}
              {new Date(preSale.createdAt).toLocaleString('es-AR')}
            </div>
            <div>
              <span className="font-bold">Actualizado:</span>{' '}
              {new Date(preSale.updatedAt).toLocaleString('es-AR')}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
