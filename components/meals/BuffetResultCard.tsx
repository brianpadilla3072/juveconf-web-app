'use client';

import { AlertTriangle, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BuffetStatus, BuffetView } from '@/entities/Meal';
import { BUFFET_STATUS_MESSAGES } from '@/lib/meals';

interface BuffetResultCardProps {
  view: BuffetView;
  slotName: string;
  isDelivering: boolean;
  onDeliver: () => void;
  onClose: () => void;
}

const STATUS_STYLES: Record<
  BuffetStatus,
  { banner: string; border: string; icon: React.ComponentType<{ className?: string }> }
> = {
  PENDING: {
    banner: 'bg-green-500/20 text-green-300',
    border: 'border-green-500',
    icon: CheckCircle2,
  },
  DELIVERED: {
    banner: 'bg-amber-500/20 text-amber-300',
    border: 'border-amber-500',
    icon: AlertTriangle,
  },
  NOT_PURCHASED: {
    banner: 'bg-red-500/20 text-red-300',
    border: 'border-red-500',
    icon: XCircle,
  },
  UNPAID: {
    banner: 'bg-red-500/20 text-red-300',
    border: 'border-red-500',
    icon: XCircle,
  },
};

/** Resultado de una lectura: solo nombre, menú y estado (sin datos personales) */
export function BuffetResultCard({
  view,
  slotName,
  isDelivering,
  onDeliver,
  onClose,
}: BuffetResultCardProps) {
  const style = STATUS_STYLES[view.status] ?? STATUS_STYLES.NOT_PURCHASED;
  const StatusIcon = style.icon;
  const deliveredTime =
    view.status === 'DELIVERED' && view.deliveredAt
      ? new Date(view.deliveredAt).toLocaleTimeString('es-AR', {
          hour: '2-digit',
          minute: '2-digit',
        })
      : null;

  return (
    <section
      className={`rounded-2xl border-2 bg-neutral-900 p-5 space-y-4 ${style.border}`}
      aria-live="polite"
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-white/50">{slotName}</p>
        <h2 className="mt-1 text-3xl font-extrabold leading-tight text-white break-words">
          {view.name}
        </h2>
        {view.code && <p className="mt-1 font-mono text-base text-white/60">{view.code}</p>}
      </div>

      {view.menu && (
        <p className="text-xl font-semibold text-white break-words">{view.menu}</p>
      )}

      <div
        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-lg font-bold ${style.banner}`}
      >
        <StatusIcon className="h-6 w-6 flex-shrink-0" />
        <span>
          {BUFFET_STATUS_MESSAGES[view.status] ?? view.status}
          {deliveredTime && <span className="font-normal"> ({deliveredTime})</span>}
        </span>
      </div>

      {view.status === 'PENDING' && (
        <Button
          className="h-20 w-full bg-green-600 text-2xl font-extrabold tracking-wide text-white hover:bg-green-500"
          onClick={onDeliver}
          disabled={isDelivering}
        >
          {isDelivering ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : null}
          ENTREGAR
        </Button>
      )}

      <Button
        variant="outline"
        className="h-14 w-full border-white/20 bg-transparent text-base text-white hover:bg-white/10 hover:text-white"
        onClick={onClose}
        disabled={isDelivering}
      >
        {view.status === 'PENDING' ? 'Cancelar' : 'Cerrar y seguir escaneando'}
      </Button>
    </section>
  );
}

export default BuffetResultCard;
