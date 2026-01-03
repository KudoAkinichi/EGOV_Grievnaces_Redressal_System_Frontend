import { UserRole } from '../enums/user-role.enum';

export interface CreateOfficerRequest {
  fullName: string;
  email: string;
  role: UserRole;
  departmentId: number;
  phone: string;
}

export interface CreateOfficerResponse {
  userId: number;
  email: string;
  temporaryPassword: string;
}
