import type { MealConfig } from './Meal';

export interface EventDay {
  date: string;           // YYYY-MM-DD
  dayNumber: number;      // 1, 2, 3, 4...
  label?: string;         // "Día 1 - Apertura"
  type?: string;          // "plenaria", "talleres", "general"
}

export interface EventDays {
  days: EventDay[];
  totalDays: number;
}

export interface Event {
  id: string;
  year: number;
  topic: string;
  capacity: number;
  salesStartDate: string;
  salesEndDate?: string;
  location?: string;
  description?: string;
  isActive?: boolean;

  // Nuevos campos de fechas del evento
  eventStartDate?: string;
  eventEndDate?: string;
  eventDays?: EventDays;

  // Menú de comidas (solo lectura: se modifica con PATCH /meals/config/:eventId, nunca con /events).
  // Las comidas se activan por combo (Combo.mealsEnabled), no por evento.
  mealConfig?: MealConfig | null;

  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  combos?: Array<{
    id: string;
    name: string;
    price: number;
    isActive: boolean;
  }>;
  preSales?: Array<{
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
  }>;
}

export interface CreateEventDto {
  year: number;
  topic: string;
  capacity: number;
  salesStartDate: string;
  salesEndDate?: string;
  location?: string;
  description?: string;
  isActive?: boolean;

  // Fechas del evento
  eventStartDate?: string;
  eventEndDate?: string;
}

export interface UpdateEventDto {
  year?: number;
  topic?: string;
  capacity?: number;
  salesStartDate?: string;
  salesEndDate?: string;
  location?: string;
  description?: string;
  isActive?: boolean;

  // Fechas del evento
  eventStartDate?: string;
  eventEndDate?: string;
}
