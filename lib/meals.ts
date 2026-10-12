import type {
  BuffetStatus,
  MealConfig,
  MealDiscountTiers,
  MealRegistration,
  MealSlot,
} from '@/entities/Meal';

// ---------------------------------------------------------------------------
// Plantilla JueConfe
// ---------------------------------------------------------------------------

export const EMPTY_DISCOUNT_TIERS: MealDiscountTiers = { '2': 0, '3': 0, '4': 0 };

export function emptyMealConfig(): MealConfig {
  return { slots: [], discountTiers: { ...EMPTY_DISCOUNT_TIERS } };
}

/** Plantilla de turnos y menús de JueConfe 2026 (carta oficial; los descuentos se completan a mano) */
export function buildJueConfeMealTemplate(): MealConfig {
  return {
    slots: [
      {
        code: 'FRI_NIGHT',
        name: 'Viernes noche',
        order: 1,
        options: [
          { n: 1, name: 'Menú pizza muzzarella (8 porciones) + agua', price: 10000 },
          { n: 2, name: 'Menú pizza jamón y muzzarella (8 porciones) + agua', price: 10000 },
        ],
      },
      {
        code: 'SAT_NOON',
        name: 'Sábado mediodía',
        order: 2,
        options: [{ n: 1, name: 'Menú deportivo: sándwich de fiambre + agua', price: 3500 }],
      },
      {
        code: 'SAT_NIGHT',
        name: 'Sábado noche',
        order: 3,
        options: [{ n: 1, name: 'Sándwich de milanesa de pollo + agua', price: 8000 }],
      },
      {
        code: 'SUN_NOON',
        name: 'Domingo mediodía',
        order: 4,
        options: [{ n: 1, name: 'Choripán al disco + agua', price: 8000 }],
      },
      {
        code: 'SUN_NIGHT',
        name: 'Domingo noche',
        order: 5,
        options: [{ n: 1, name: 'Sándwich de milanesa + agua', price: 8000 }],
      },
    ],
    discountTiers: { ...EMPTY_DISCOUNT_TIERS },
  };
}

// ---------------------------------------------------------------------------
// Helpers de presentación
// ---------------------------------------------------------------------------

export const NIGHT_LABELS: Record<string, string> = {
  FRI: 'Viernes',
  SAT: 'Sábado',
};

export function nightLabel(night: string): string {
  return NIGHT_LABELS[night] ?? night;
}

export function formatNights(nights: string[]): string {
  return nights.map(nightLabel).join(' y ');
}

export function sortSlots(slots: MealSlot[] | undefined | null): MealSlot[] {
  return [...(slots ?? [])].sort((a, b) => a.order - b.order);
}

export function slotNameByCode(
  slots: MealSlot[] | undefined | null,
  code: string,
): string {
  return slots?.find((s) => s.code === code)?.name ?? code;
}

/** Resumen corto de las comidas de una inscripción, ej: "Sábado noche: Sándwich de milanesa de pollo + agua" */
export function mealLines(
  registration: Pick<MealRegistration, 'meals'>,
  slots: MealSlot[] | undefined | null,
): string[] {
  return registration.meals.map(
    (m) => `${slotNameByCode(slots, m.slotCode)}: ${m.optionName}`,
  );
}

export function formatMoney(value: number | string | null | undefined): string {
  const n = Number(value ?? 0);
  return `$${(Number.isFinite(n) ? n : 0).toLocaleString('es-AR')}`;
}

// ---------------------------------------------------------------------------
// Buffet
// ---------------------------------------------------------------------------

export const BUFFET_STATUS_MESSAGES: Record<BuffetStatus, string> = {
  PENDING: 'PENDIENTE DE ENTREGA',
  DELIVERED: 'Comida ya entregada',
  NOT_PURCHASED: 'No tiene comida comprada para este turno',
  UNPAID: 'Pago no confirmado',
};

// ---------------------------------------------------------------------------
// Errores de la API
// ---------------------------------------------------------------------------

export interface ApiErrorInfo {
  message: string;
  errors: string[];
}

/** Extrae `message` y `errors[]` de una respuesta de error de axios */
export function extractApiError(err: any, fallback: string): ApiErrorInfo {
  const data = err?.response?.data;
  const rawMessage = data?.message;
  let message = fallback;

  if (typeof rawMessage === 'string' && rawMessage.trim()) {
    message = rawMessage;
  } else if (Array.isArray(rawMessage) && rawMessage.length > 0) {
    message = rawMessage.join('. ');
  } else if (!err?.response && err?.request) {
    message = 'No se recibió respuesta del servidor. Verificá tu conexión.';
  }

  const errors = Array.isArray(data?.errors)
    ? data.errors.filter((e: unknown): e is string => typeof e === 'string')
    : [];

  return { message, errors };
}
