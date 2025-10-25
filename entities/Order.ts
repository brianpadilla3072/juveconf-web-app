import { Combo } from './Combo';
import { Event } from './Event';
import { Payment } from './Payment';
import { Attendee } from './Attendee';

export interface AttendeeDto {
  name: string;
  cuil: string;
}

export interface Order {
  id: string;
  year: number;
  userId: string | null;
  eventId: string;
  comboId: string;
  total: number;
  status: 'PENDING' | 'REVIEW' | 'PAID' | 'CANCELLED';
  paymentType: 'TRANSFER' | 'MERCADOPAGO' | 'CASH';
  externalReference: string | null;
  metadataToken: string;
  preferenceId: string | null;
  email: string;
  phone?: string;
  cuil: string;
  orderSnapshot?: any;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  // Relations
  user?: any;
  event?: Event;
  combo: Combo;
  payments?: Payment[];
  invitees?: Attendee[];
}

export interface CreateOrderDto {
  year: number;
  userId?: string;
  eventId: string;
  comboId: string;
  total: number;
  paymentType: 'TRANSFER' | 'MERCADOPAGO' | 'CASH';
  email: string;
  phone?: string;
  cuil: string;
  externalReference?: string;
  orderSnapshot?: any;
}

export interface UpdateOrderDto {
  status?: 'PENDING' | 'REVIEW' | 'PAID' | 'CANCELLED';
  paymentType?: 'TRANSFER' | 'MERCADOPAGO' | 'CASH';
  total?: number;
  externalReference?: string;
  orderSnapshot?: any;
}

export interface CreateTransferOrderDto {
  id: string; // comboId
  email: string;
  phone: string;
  cuil: string;
  title: string; // combo name
  unit_price: number;
  quantity: number;
  minPersons: number;
  maxPersons?: number;
  attendees: AttendeeDto[];
  eventId: string;
  userId?: string;
}
