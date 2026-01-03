export enum GrievanceStatus {
  SUBMITTED = 'SUBMITTED',
  ASSIGNED = 'ASSIGNED',
  IN_REVIEW = 'IN_REVIEW',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  ESCALATED = 'ESCALATED',
}

export enum GrievancePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface Grievance {
  id: number;
  grievanceNumber: string;
  citizenId: number;
  departmentId: number;
  categoryId: number;
  title: string;
  description: string;
  status: GrievanceStatus;
  priority: GrievancePriority;
  assignedOfficerId?: number;
  escalatedToSupervisorId?: number;
  resolutionRemarks?: string;
  createdAt: string;
  assignedAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  escalatedAt?: string;
  autoEscalationTime?: string;

  // Additional fields from joins (if populated)
  departmentName?: string;
  categoryName?: string;
  citizenName?: string;
  officerName?: string;
}

export interface CreateGrievanceRequest {
  title: string;
  description: string;
  departmentId: number;
  categoryId: number;
}

export interface UpdateGrievanceStatusRequest {
  status: GrievanceStatus;
  remarks?: string;
}
