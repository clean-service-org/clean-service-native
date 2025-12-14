// Service Type related types

export interface ServiceCategory {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  isActive: boolean;
}

export interface RoomPricing {
  id: string;
  serviceTypeId: string;
  roomType: string;
  roomCount: number;
  additionalPrice: number;
  createdAt: string;
}

export interface DurationPrice {
  id: string;
  serviceTypeId: string;
  durationHours: number;
  priceMultiplier: number;
  createdAt: string;
}

export interface ServiceType {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  basePrice: number;
  createdAt: string;
  isActive: boolean;
  category: ServiceCategory;
  roomPricing: RoomPricing[];
  durationPrice: DurationPrice[];
}

export interface ServiceTypeResponse {
  statusCode: number;
  message: string;
  data: {
    totalItems: number;
    currentPage: number;
    nextPage: number | null;
    previousPage: number | null;
    totalPages: number;
    results: ServiceType[];
  };
}
