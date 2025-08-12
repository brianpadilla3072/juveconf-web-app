export interface Combo {
  id: string;
  name: string;
  price: number;
  year: number;
  minPersons: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  eventId: string;
  event?: {
    id: string;
    year: number;
    topic: string;
    capacity: number;
    salesStartDate: string;
  };
}

export interface CreateComboDto {
  name: string;
  price: number;
  year: number;
  minPersons: number;
  eventId: string;
}

export interface UpdateComboDto {
  name?: string;
  price?: number;
  year?: number;
  minPersons?: number;
  eventId?: string;
}