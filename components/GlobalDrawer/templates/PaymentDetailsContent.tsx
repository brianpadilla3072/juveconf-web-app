'use client';

import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  CreditCard,
  Mail,
  User,
  DollarSign,
  Calendar,
  Package,
  FileText
} from 'lucide-react';
import { Payment } from '@/entities/Payment';

interface PaymentDetailsContentProps {
  payment: Payment;
}

export function PaymentDetailsContent({ payment }: PaymentDetailsContentProps) {
  return (
    <>
      <SheetHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-violet-100 rounded-full">
            <CreditCard className="h-6 w-6 text-violet-600" />
          </div>
          <div className="flex-1">
            <SheetTitle className="text-2xl font-bold text-violet-900">
              Pago #{payment.id.substring(0, 8)}
            </SheetTitle>
            <SheetDescription className="text-violet-600">
              {new Date(payment.createdAt).toLocaleDateString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </SheetDescription>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Badge variant="default" className="text-sm">
            {payment.type}
          </Badge>
          <Badge variant="secondary" className="text-sm">
            Año: {payment.year}
          </Badge>
        </div>
      </SheetHeader>

      <Separator className="my-4" />

      <div className="space-y-6">
        {/* Información del Pagador */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
          <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
            <User className="h-5 w-5 text-violet-600" />
            Información del Pagador
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 text-slate-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Nombre</p>
                <p className="text-sm text-slate-900 font-medium">
                  {payment.payerName || '-'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-slate-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Email</p>
                <p className="text-sm text-slate-900 font-medium break-all">
                  {payment.payerEmail || '-'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="h-4 w-4 text-slate-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">DNI</p>
                <p className="text-sm text-slate-900 font-medium">
                  {payment.payerDni || '-'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Información del Pago */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
          <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-violet-600" />
            Detalles del Pago
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <DollarSign className="h-4 w-4 text-slate-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Monto</p>
                <p className="text-2xl text-slate-900 font-bold">
                  ${payment.amount.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="h-4 w-4 text-slate-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Tipo de Pago</p>
                <p className="text-sm text-slate-900 font-medium">
                  {payment.type}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-slate-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Año del Evento</p>
                <p className="text-sm text-slate-900 font-medium">
                  {payment.year}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Orden Asociada */}
        {payment.order && (
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
            <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
              <Package className="h-5 w-5 text-violet-600" />
              Orden Asociada
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Package className="h-4 w-4 text-slate-500 mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 font-medium">Estado de Orden</p>
                  <Badge
                    variant={
                      payment.order.status === 'PAID'
                        ? 'default'
                        : payment.order.status === 'PENDING'
                        ? 'secondary'
                        : 'destructive'
                    }
                  >
                    {payment.order.status}
                  </Badge>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-slate-500 mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 font-medium">Cantidad de Invitados</p>
                  <p className="text-sm text-slate-900 font-medium">
                    {payment.order.quantity || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* IDs de Referencia */}
        <div className="bg-slate-100/50 rounded-lg p-4 border border-slate-200">
          <h4 className="text-xs font-semibold text-slate-600 mb-2">IDs de Referencia</h4>
          <div className="space-y-2 text-xs font-mono text-slate-500">
            <div>
              <span className="font-bold">Payment ID:</span> {payment.id}
            </div>
            {payment.orderId && (
              <div>
                <span className="font-bold">Order ID:</span> {payment.orderId}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
