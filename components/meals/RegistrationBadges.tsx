'use client';

import { Badge } from '@/components/ui/badge';
import type { MealRegistration } from '@/entities/Meal';

type BadgeSource = Pick<MealRegistration, 'paymentState' | 'accredited' | 'proofSent'>;

/** Estado principal de la inscripción: Acreditado > Pago confirmado > Pago pendiente */
export function RegistrationStateBadge({ registration }: { registration: BadgeSource }) {
  if (registration.accredited) {
    return <Badge className="bg-violet-600 hover:bg-violet-600 text-white">Acreditado</Badge>;
  }
  if (registration.paymentState === 'CONFIRMED') {
    return <Badge className="bg-green-600 hover:bg-green-600 text-white">Pago confirmado</Badge>;
  }
  return (
    <Badge variant="outline" className="border-amber-400 bg-amber-50 text-amber-800">
      Pago pendiente
    </Badge>
  );
}

export function RegistrationBadges({ registration }: { registration: BadgeSource }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <RegistrationStateBadge registration={registration} />
      {registration.proofSent && (
        <Badge variant="outline" className="border-blue-300 bg-blue-50 text-blue-800">
          Comprobante enviado
        </Badge>
      )}
    </div>
  );
}
