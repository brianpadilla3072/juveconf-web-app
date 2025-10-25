export interface AttendanceRecord {
  attended: boolean;
  timestamp?: string;
  notes?: string;
}

export interface Attendance {
  days: {
    [dayNumber: string]: AttendanceRecord;
  };
}

export interface Invitee {
  id: string;
  name: string;
  cuil: string;
  email?: string;
  phone?: string;
  orderId?: string;
  paymentId?: string;

  // Metadata adicional como JSON string: { email?, phone?, birthdate?, city?, church? }
  metadata?: string;

  // Sistema dinámico de asistencia
  attendance?: Attendance;

  createdAt: string;
  updatedAt: string;
  deletedAt?: string;

  // Relaciones opcionales
  order?: {
    id: string;
    status: string;
  };
  payment?: {
    id: string;
    amount: number;
    payerEmail?: string;
  };
}

export interface CreateInviteeDto {
  name: string;
  cuil: string;
  email?: string;
  phone?: string;
  metadata?: string;
  orderId?: string;
  paymentId?: string;
}

export interface UpdateInviteeDto {
  name?: string;
  cuil?: string;
  email?: string;
  phone?: string;
  metadata?: string;
  orderId?: string;
  paymentId?: string;
}

export interface MarkAttendanceDto {
  dayNumber: number;
  attended: boolean;
}
