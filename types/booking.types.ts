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

// Scheduler/Activity related types
export interface SchedulerCustomer {
  id: string;
  gender: string | null;
  fullName: string;
  identityCard: string | null;
  address: string | null;
  phoneNumber: string | null;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface SchedulerUser {
  id: string;
  gender: string | null;
  fullName: string;
  identityCard: string | null;
  address: string | null;
  phoneNumber: string | null;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface SchedulerHelper {
  id: string;
  experienceDescription: string | null;
  servicesOffered: string[];
  hourlyRate: number;
  averageRating: number;
  user: SchedulerUser;
}

export interface SchedulerServiceType {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  basePrice: number;
  createdAt: string;
}

export interface SchedulerBookingDetails {
  id: string;
  bookingId: string;
  durationPriceId: string;
  bedroomCount: number;
  bathroomCount: number;
  kitchenCount: number;
  livingRoomCount: number;
  specialRequirements: string | null;
  createdAt: string;
}

export interface SchedulerBooking {
  id: string;
  customerId: string;
  helperId: string;
  serviceTypeId: string;
  location: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  status: string;
  cancellationReason: string | null;
  totalPrice: number;
  paymentStatus: string;
  paymentMethod: string;
  helperRating: number | null;
  createdAt: string;
  updatedAt: string;
  customer: SchedulerCustomer;
  helper: SchedulerHelper;
  serviceType: SchedulerServiceType;
  bookingDetails: SchedulerBookingDetails;
  bookingRefunds: any[];
}

export interface SchedulerResponse {
  totalItems: number;
  currentPage: number;
  nextPage: number | null;
  previousPage: number | null;
  totalPages: number;
  results: SchedulerBooking[];
}
