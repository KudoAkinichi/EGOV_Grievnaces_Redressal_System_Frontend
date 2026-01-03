import { UserRole } from '../enums/user-role.enum';

export interface GrievanceComment {
  id: number;
  grievanceId: number;
  senderId: number;
  senderRole: UserRole;
  message: string;
  isInternal: boolean;
  createdAt: string;
}

export interface CreateCommentRequest {
  message: string;
  isInternal: boolean;
}
