import Constants from 'expo-constants';

const API_BASE_URL =
  Constants.expoConfig?.extra?.BACKEND_API || 'https://cleanservice.app/api';

export enum BookingStatus {
  pending = "Pending",

  confirmed = "Confirmed",

  in_progress = "InProgress",

  completed = "Completed",

  cancelled = "Cancelled",
}

export interface Customer {
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

export interface HelperUser {
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

export interface Helper {
  id: string;
  experienceDescription: string | null;
  servicesOffered: string[];
  hourlyRate: number;
  averageRating: number;
  user: HelperUser;
}

export interface ServiceType {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  basePrice: number;
  createdAt: string;
}

export interface BookingDetails {
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

export interface Booking {
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
  customer: Customer;
  helper: Helper;
  serviceType: ServiceType;
  bookingDetails: BookingDetails;
  bookingRefunds: any[];
}

export interface SchedulerResponse {
  statusCode: number;
  message: string;
  data: {
    totalItems: number;
    currentPage: number;
    nextPage: number | null;
    previousPage: number | null;
    totalPages: number;
    results: Booking[];
  };
}

export interface UpdateBookingRequestDto {
  status?: BookingStatus;

  cancellationReason?: string;
}

export async function updateBookingStatus(
  bookingId: string,

  data: UpdateBookingRequestDto,
): Promise<any> {

  console.log('Updating booking status:', bookingId, data);

  console.log(JSON.stringify(data), "------------------------------------------");
  const response = await fetch(
    `${API_BASE_URL}/booking/update/${bookingId}`,
    {
      method: 'PATCH',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(data),

      credentials: 'include',
    },
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: 'Failed to update booking' }));

    throw new Error(error.message || 'Failed to update booking');
  }

  return response.json();
}

export async function getBookingById(bookingId: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/booking/${bookingId}`, {
    method: 'GET',

    headers: {
      'Content-Type': 'application/json',
    },

    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch booking details');
  }

  return response.json();
}

export async function getHelperBookings(helperId: string, page: number = 1, pageSize: number = 10): Promise<SchedulerResponse> {
  const response = await fetch(`${API_BASE_URL}/scheduler?helperId=${helperId}&page=${page}&pageSize=${pageSize}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch bookings' }));
    throw new Error(error.message || 'Failed to fetch bookings');
  }

  return response.json();
}

export async function startTask(bookingId: string): Promise<any> {
  return updateBookingStatus(bookingId, { status: BookingStatus.in_progress });
}

export async function completeTask(bookingId: string): Promise<any> {
  return updateBookingStatus(bookingId, { status: BookingStatus.completed });
}

export async function cancelTask(bookingId: string, reason?: string): Promise<any> {
  return updateBookingStatus(bookingId, {
    status: BookingStatus.cancelled,

    cancellationReason: reason,
  });
}

