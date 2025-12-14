export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Task {
  id: string;
  title: string;
  description: string;
  location?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  materials?: string[];
  assignedAt?: string;
  acceptedAt?: string;
  startedAt?: string;
  finishedAt?: string;
  reportedAt?: string;
  status: BookingStatus;
  attachments?: string[];
}

export function getDisplayStatus(status: BookingStatus): string {
  const statusMap: Record<BookingStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  return statusMap[status];
}

export interface TaskReport {
  taskId: string;
  summary: string;
  photos: string[];
  materialsUsed?: string[];
  customerSignature?: string;
  issues?: string;
}
