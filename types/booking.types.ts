// Booking related types based on API schema

export interface CreateBookingDetails {
  durationPriceId?: string | null;
  bedroomCount?: number;
  bathroomCount?: number;
  kitchenCount?: number;
  livingRoomCount?: number;
  specialRequirements?: string | null;
}

export interface CreateBookingRequest {
  customerId: string;
  serviceTypeId: string;
  location?: string | null;
  scheduledStartTime: string; // ISO 8601 date-time format
  scheduledEndTime: string; // ISO 8601 date-time format
  paymentMethod?: string | null;
  bookingDetails?: CreateBookingDetails;
  contractContent?: string | null;
}

export interface UpdateBookingRequest {
  status?: string;
  location?: string;
  scheduledStartTime?: string;
  scheduledEndTime?: string;
  paymentMethod?: string;
  bookingDetails?: CreateBookingDetails;
}

export interface BookingResponse {
  id: string;
  customerId: string;
  serviceTypeId: string;
  location: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  paymentMethod: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

// For local state management in booking form
export interface BookingFormData {
  address: string;
  latitude: number;
  longitude: number;
  scheduledDate: Date;
  startTime: Date;
  endTime: Date;
  durationHours: number;
  selectedAddOns: string[];
  selectedOptions: string[];
  paymentMethod: string;
  bedroomCount: number;
  bathroomCount: number;
  kitchenCount: number;
  livingRoomCount: number;
  specialRequirements: string;
}
