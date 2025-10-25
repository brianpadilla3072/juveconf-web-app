export interface Combo {
  id: string;
  name: string;
  price: number;
  personsIncluded: number;
  maxPersons?: number;
  isActive?: boolean;
  isPublished?: boolean;
  isFree?: boolean;
  description?: string;
  displayOrder?: number;
  metadata?: any;
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
  preSalePrices?: Array<{
    id: string;
    price: number;
    preSale: {
      id: string;
      name: string;
      startDate: string;
      endDate: string;
    };
  }>;
  currentPrice?: {
    price: number;
    preSaleName: string | null;
    preSaleId: string | null;
    isPreSale: boolean;
    originalPrice: number;
    discount: number;
  };
}

export interface CreateComboDto {
  name: string;
  price: number;
  personsIncluded: number;
  eventId: string;
  maxPersons?: number;
  isActive?: boolean;
  isPublished?: boolean;
  isFree?: boolean;
  description?: string;
  displayOrder?: number;
  metadata?: any;
}

export interface UpdateComboDto {
  name?: string;
  price?: number;
  personsIncluded?: number;
  eventId?: string;
  maxPersons?: number;
  isActive?: boolean;
  isPublished?: boolean;
  isFree?: boolean;
  description?: string;
  displayOrder?: number;
  metadata?: any;
}