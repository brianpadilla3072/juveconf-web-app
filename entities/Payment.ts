import { Attendance } from './Invitee';

export interface Payment {
  id: string;
  year: number;
  orderId: string;
  amount: number;
  type: 'TRANSFER' | 'MERCADOPAGO' | 'CASH';
  externalReference?: string;
  userId?: string;
  payerName?: string;
  payerEmail?: string;
  payerDni?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  order?: {
    id: string;
    year: number;
    total: number;
    status: 'PENDING' | 'REVIEW' | 'PAID';
    email: string;
    cuil: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  invitees?: Array<{
    id: string;
    name: string;
    cuil: string;
    attendance?: Attendance;
  }>;
}

export interface CreatePaymentDto {
  year: number;
  orderId: string;
  amount: number;
  type: 'TRANSFER' | 'MERCADOPAGO' | 'CASH';
  externalReference?: string;
  userId?: string;
  payerName?: string;
  payerEmail?: string;
  payerDni?: string;
}

export interface UpdatePaymentDto {
  year?: number;
  orderId?: string;
  amount?: number;
  type?: 'TRANSFER' | 'MERCADOPAGO' | 'CASH';
  externalReference?: string;
  userId?: string;
  payerName?: string;
  payerEmail?: string;
  payerDni?: string;
}

export interface PaymentSummary {
  totalAmount: number;
  totalPayments: number;
  paymentsByType: {
    TRANSFER: number;
    MERCADOPAGO: number;
    CASH: number;
  };
  recentPayments: Payment[];
}