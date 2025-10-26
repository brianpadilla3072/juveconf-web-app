'use client';

import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingCart,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  Package,
  User,
  CreditCard,
  Check,
  X
} from 'lucide-react';
import { Order } from '@/entities/Order';

interface OrderDetailsContentProps {
  order: Order;
  onApprove?: () => void;
  onReject?: () => void;
  isApproving?: boolean;
  isRejecting?: boolean;
}

export function OrderDetailsContent({ order, onApprove, onReject, isApproving, isRejecting }: OrderDetailsContentProps) {
  return (
    <>
      <SheetHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-violet-100 rounded-full">
            <ShoppingCart className="h-6 w-6 text-violet-600" />
          </div>
          <div className="flex-1">
            <SheetTitle className="text-2xl font-bold text-violet-900">
              Orden #{order.id.substring(0, 8)}
            </SheetTitle>
            <SheetDescription className="text-violet-600">
              Creada: {new Date(order.createdAt).toLocaleDateString('es-AR')}
            </SheetDescription>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Badge
            variant={
              order.status === 'PAID'
                ? 'default'
                : order.status === 'PENDING'
                ? 'secondary'
                : 'destructive'
            }
            className="text-sm"
          >
            {order.status}
          </Badge>
        </div>
      </SheetHeader>

      <Separator className="my-4" />

      <div className="space-y-6">
        {/* Información de Contacto */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
          <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
            <User className="h-5 w-5 text-violet-600" />
            Información de Contacto
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-slate-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Email</p>
                <p className="text-sm text-slate-900 font-medium break-all">
                  {order.email || '-'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-slate-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Teléfono</p>
                <p className="text-sm text-slate-900 font-medium">
                  {order.phone || '-'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Información del Evento y Combo */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
          <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
            <Package className="h-5 w-5 text-violet-600" />
            Detalles de la Orden
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-slate-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Evento</p>
                <p className="text-sm text-slate-900 font-medium">
                  {order.event?.topic || 'N/A'} - {order.event?.year || ''}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Package className="h-4 w-4 text-slate-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Combo</p>
                <p className="text-sm text-slate-900 font-medium">
                  {order.combo?.name || 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 text-slate-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Cantidad de Invitados</p>
                <p className="text-sm text-slate-900 font-medium">
                  {order.invitees?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Información de Pago */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
          <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-violet-600" />
            Información de Pago
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <DollarSign className="h-4 w-4 text-slate-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Monto Total</p>
                <p className="text-sm text-slate-900 font-bold">
                  ${order.total?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="h-4 w-4 text-slate-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Método de Pago</p>
                <p className="text-sm text-slate-900 font-medium">
                  {order.paymentType === 'TRANSFER' ? 'Transferencia' :
                   order.paymentType === 'CASH' ? 'Efectivo' :
                   order.paymentType === 'MERCADOPAGO' ? 'MercadoPago' : 'Pendiente'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* IDs de Referencia */}
        <div className="bg-slate-100/50 rounded-lg p-4 border border-slate-200">
          <h4 className="text-xs font-semibold text-slate-600 mb-2">IDs de Referencia</h4>
          <div className="space-y-2 text-xs font-mono text-slate-500">
            <div>
              <span className="font-bold">Order ID:</span> {order.id}
            </div>
            {order.eventId && (
              <div>
                <span className="font-bold">Event ID:</span> {order.eventId}
              </div>
            )}
            {order.comboId && (
              <div>
                <span className="font-bold">Combo ID:</span> {order.comboId}
              </div>
            )}
            {order.paymentId && (
              <div>
                <span className="font-bold">Payment ID:</span> {order.paymentId}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons - Only show for REVIEW status */}
        {order.status === 'REVIEW' && (onApprove || onReject) && (
          <>
            <Separator className="my-4" />
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-700">Acciones</h4>
              <div className="grid grid-cols-2 gap-3">
                {onReject && (
                  <Button
                    variant="outline"
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={onReject}
                    disabled={isRejecting || isApproving}
                  >
                    <X className="mr-2 h-4 w-4" />
                    {isRejecting ? 'Rechazando...' : 'Rechazar'}
                  </Button>
                )}
                {onApprove && (
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={onApprove}
                    disabled={isApproving || isRejecting}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    {isApproving ? 'Aprobando...' : 'Aprobar'}
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
