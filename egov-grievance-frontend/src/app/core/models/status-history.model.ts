import { GrievanceStatus } from '../enums/grievance-status.enum';

export interface StatusHistory {
  id: number;
  grievanceId: number;
  oldStatus: GrievanceStatus | null;
  newStatus: GrievanceStatus;
  changedBy: number;
  remarks: string;
  createdAt: string;
}
