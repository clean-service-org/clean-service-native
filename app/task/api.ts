import Constants from 'expo-constants';

const API_BASE_URL =
  Constants.expoConfig?.extra?.BACKEND_API || 'https://cleanservice.app/api';

export enum BookingStatus {
  pending = 0,

  confirmed = 1,

  in_progress = 2,

  completed = 3,

  cancelled = 4,
}

export interface UpdateBookingRequestDto {
  status?: BookingStatus;

  cancellationReason?: string;
}

export async function updateBookingStatus(
  bookingId: string,

  data: UpdateBookingRequestDto,
): Promise<any> {
  // Debugging ID

  const debugBookingId = '108da774-05e9-4219-ad75-584881508ff1';

  // Not using bookingId parameter for now

  const response = await fetch(
    `${API_BASE_URL}/booking/update/${debugBookingId}`,
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

export async function acceptTask(bookingId: string): Promise<any> {
  return updateBookingStatus(bookingId, { status: BookingStatus.confirmed });
}

export async function startTask(bookingId: string): Promise<any> {
  return updateBookingStatus(bookingId, { status: BookingStatus.in_progress });
}

export async function completeTask(bookingId: string): Promise<any> {
  return updateBookingStatus(bookingId, { status: BookingStatus.completed });
}

export async function cancelTask(
  bookingId: string,
  reason: string,
): Promise<any> {
  return updateBookingStatus(bookingId, {
    status: BookingStatus.cancelled,

    cancellationReason: reason,
  });
}

