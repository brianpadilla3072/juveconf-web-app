/**
 * Tipos del módulo de Comidas.
 * Reflejan el contrato de la API (/meals/*) y la configuración que viaja en el evento.
 */

export interface MealOption {
  /** Número de menú dentro del turno (1, 2, 3...) */
  n: number;
  name: string;
  price: number;
}

export interface MealSlot {
  /** Código estable del turno, ej: FRI_NIGHT, SAT_NIGHT */
  code: string;
  name: string;
  order: number;
  options: MealOption[];
}

/** Porcentaje de descuento según la cantidad de comidas por persona */
export interface MealDiscountTiers {
  '2': number;
  '3': number;
  '4': number;
}

export interface MealConfig {
  slots: MealSlot[];
  discountTiers: MealDiscountTiers;
}

export type MealPaymentState = 'PENDING' | 'CONFIRMED';

export interface MealRegistrationMeal {
  slotCode: string;
  optionName: string;
  delivered: boolean;
}

export interface MealRegistrationLodging {
  needed: boolean;
  /** "FRI" | "SAT" */
  nights: string[];
}

export interface MealRegistration {
  key: string;
  orderId: string;
  paymentState: MealPaymentState;
  orderStatus: string;
  proofSent: boolean;
  orderTotal: number;
  inviteeId: string | null;
  /** Código de inscripción (ej: "JC-0247"); null mientras el pago está pendiente */
  code: string | null;
  name: string;
  cuil: string | null;
  email: string | null;
  phone: string | null;
  accredited: boolean;
  city: string | null;
  church: string | null;
  group: string | null;
  lodging: MealRegistrationLodging;
  emergency: { name: string; phone: string } | null;
  dietary: string | null;
  guardian: unknown | null;
  meals: MealRegistrationMeal[];
  createdAt: string;
}

export interface MealStatsOption {
  optionName: string;
  sold: number;
  delivered: number;
  pending: number;
}

export interface MealStatsSlot {
  slotCode: string;
  name: string;
  sold: number;
  delivered: number;
  pending: number;
  options: MealStatsOption[];
}

export interface MealStats {
  registrations: {
    total: number;
    pendingPayment: number;
    proofSentPending: number;
    confirmed: number;
    accredited: number;
  };
  meals: MealStatsSlot[];
  lodgingByNight: Record<string, number>;
}

/** Respuesta de PATCH /meals/config/:eventId */
export interface MealsConfigResponse {
  id: string;
  mealConfig: MealConfig | null;
}

/**
 * Las comidas se activan por combo (`Combo.mealsEnabled`); el evento solo guarda
 * el menú (`mealConfig`).
 */
export interface UpdateMealsConfigPayload {
  mealConfig: MealConfig;
}

// ---------------------------------------------------------------------------
// Buffet (solo nombre, menú y estado: nunca datos personales)
// ---------------------------------------------------------------------------

export type BuffetStatus = 'PENDING' | 'DELIVERED' | 'NOT_PURCHASED' | 'UNPAID';

export interface BuffetView {
  inviteeId: string;
  code: string | null;
  name: string;
  menu: string | null;
  status: BuffetStatus;
  deliveredAt: string | null;
}

export interface MealScanPayload {
  inviteeId?: string;
  paymentId?: string;
  code?: string;
  slotCode: string;
}

export interface MealDeliverResult {
  delivered: boolean;
  status: BuffetStatus;
  deliveredAt?: string | null;
}
