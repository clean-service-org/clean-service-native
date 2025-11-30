export type TaskStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'READY'
  | 'IN_PROGRESS'
  | 'PAUSED'
  | 'PENDING_REPORT'
  | 'REPORTED'
  | 'REJECTED'
  | 'REWORKING'
  | 'APPROVED'
  | 'CLOSED';

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
  pausedAt?: string;
  resumedAt?: string;
  finishedAt?: string;
  reportedAt?: string;
  status: TaskStatus;
  attachments?: string[];
}

export interface TaskReport {
  taskId: string;
  summary: string;
  photos: string[];
  materialsUsed?: string[];
  customerSignature?: string;
  issues?: string;
}

export enum PauseReasonEnum {
  WAITING_MATERIAL = 'WAITING_MATERIAL',
  CUSTOMER_NOT_HOME = 'CUSTOMER_NOT_HOME',
  TECHNICAL_ISSUE = 'TECHNICAL_ISSUE',
  WEATHER = 'WEATHER',
  OTHER = 'OTHER',
}

export const PauseReasonLabels: Record<PauseReasonEnum, string> = {
  [PauseReasonEnum.WAITING_MATERIAL]: 'Waiting for Materials',
  [PauseReasonEnum.CUSTOMER_NOT_HOME]: 'Customer Not Home',
  [PauseReasonEnum.TECHNICAL_ISSUE]: 'Technical Issue',
  [PauseReasonEnum.WEATHER]: 'Weather Conditions',
  [PauseReasonEnum.OTHER]: 'Other',
};
