export interface PreSale {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  comboPrices?: Array<{
    id: string;
    comboId: string;
    price: number;
    combo?: {
      id: string;
      name: string;
      price: number;
    };
  }>;
}

export interface CreatePreSaleDto {
  eventId: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
  comboPrices: Array<{
    comboId: string;
    price: number;
  }>;
}

export interface UpdatePreSaleDto {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  comboPrices?: Array<{
    comboId: string;
    price: number;
  }>;
}
