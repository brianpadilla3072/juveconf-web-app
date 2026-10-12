'use client';

import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import {
  Utensils,
  User,
  MapPin,
  BedDouble,
  Siren,
  Salad,
  ShieldCheck,
  Check,
  CreditCard,
} from 'lucide-react';
import { RegistrationBadges } from '@/components/meals/RegistrationBadges';
import type { MealRegistration, MealSlot } from '@/entities/Meal';
import { formatMoney, formatNights, slotNameByCode } from '@/lib/meals';

interface MealRegistrationDetailsContentProps {
  registration: MealRegistration;
  slots?: MealSlot[] | null;
}

const GUARDIAN_LABELS: Record<string, string> = {
  name: 'Nombre',
  fullName: 'Nombre',
  phone: 'Teléfono',
  dni: 'DNI',
  cuil: 'CUIL',
  email: 'Email',
  relationship: 'Vínculo',
  relation: 'Vínculo',
};

function guardianEntries(guardian: unknown): Array<[string, string]> {
  if (!guardian) return [];
  if (typeof guardian === 'string') return [['Responsable', guardian]];
  if (typeof guardian === 'object') {
    return Object.entries(guardian as Record<string, unknown>)
      .filter(([, value]) => value !== null && value !== undefined && value !== '')
      .map(([key, value]) => [
        GUARDIAN_LABELS[key] ?? key,
        typeof value === 'object' ? JSON.stringify(value) : String(value),
      ]);
  }
  return [['Responsable', String(guardian)]];
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      <p className="text-sm text-slate-900 font-medium break-words">{value || '-'}</p>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
      <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
        <Icon className="h-5 w-5 text-violet-600" />
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function MealRegistrationDetailsContent({
  registration,
  slots,
}: MealRegistrationDetailsContentProps) {
  const guardian = guardianEntries(registration.guardian);

  return (
    <>
      <SheetHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-violet-100 rounded-full">
            <Utensils className="h-6 w-6 text-violet-600" />
          </div>
          <div className="flex-1">
            <SheetTitle className="text-2xl font-bold text-violet-900">
              {registration.name}
            </SheetTitle>
            <SheetDescription className="text-violet-600 font-mono">
              {registration.code ?? 'Sin código (pago pendiente)'}
            </SheetDescription>
          </div>
        </div>
        <div className="pt-2">
          <RegistrationBadges registration={registration} />
        </div>
      </SheetHeader>

      <Separator className="my-4" />

      <div className="space-y-6">
        <Section title="Contacto" icon={User}>
          <Field label="CUIL" value={registration.cuil} />
          <Field label="Email" value={registration.email} />
          <Field label="Teléfono" value={registration.phone} />
        </Section>

        <Section title="Procedencia" icon={MapPin}>
          <Field label="Ciudad" value={registration.city} />
          <Field label="Iglesia" value={registration.church} />
          <Field label="Grupo" value={registration.group} />
        </Section>

        <Section title="Comidas" icon={Utensils}>
          {registration.meals.length === 0 ? (
            <p className="text-sm text-slate-500">Sin comidas compradas</p>
          ) : (
            <ul className="space-y-2">
              {registration.meals.map((meal, i) => (
                <li key={`${meal.slotCode}-${i}`} className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">
                      {slotNameByCode(slots, meal.slotCode)}
                    </p>
                    <p className="text-sm text-slate-900 font-medium">{meal.optionName}</p>
                  </div>
                  {meal.delivered && (
                    <span className="flex items-center gap-1 text-xs font-medium text-green-700">
                      <Check className="h-4 w-4" /> Entregada
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Hospedaje" icon={BedDouble}>
          <Field
            label="Noches"
            value={
              registration.lodging?.needed
                ? formatNights(registration.lodging.nights) || 'Sí'
                : 'No necesita hospedaje'
            }
          />
        </Section>

        <Section title="Contacto de emergencia" icon={Siren}>
          {registration.emergency ? (
            <>
              <Field label="Nombre" value={registration.emergency.name} />
              <Field label="Teléfono" value={registration.emergency.phone} />
            </>
          ) : (
            <p className="text-sm text-slate-500">No informado</p>
          )}
        </Section>

        <Section title="Alimentación" icon={Salad}>
          <Field label="Restricciones / observaciones" value={registration.dietary} />
        </Section>

        {guardian.length > 0 && (
          <Section title="Responsable / tutor" icon={ShieldCheck}>
            {guardian.map(([label, value]) => (
              <Field key={label} label={label} value={value} />
            ))}
          </Section>
        )}

        <Section title="Pago" icon={CreditCard}>
          <Field label="Total de la orden" value={formatMoney(registration.orderTotal)} />
          <Field label="Estado de la orden" value={registration.orderStatus} />
          <Field
            label="Inscripción"
            value={new Date(registration.createdAt).toLocaleString('es-AR')}
          />
        </Section>
      </div>
    </>
  );
}
