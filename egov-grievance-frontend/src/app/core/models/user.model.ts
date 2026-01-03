export enum UserRole {
  CITIZEN = 'CITIZEN',
  DEPT_OFFICER = 'DEPT_OFFICER',
  SUPERVISOR = 'SUPERVISOR',
  ADMIN = 'ADMIN',
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  departmentId?: number;
  phone: string;
  aadhaarNumber?: string;
  isActive: boolean;
  isFirstLogin: boolean;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  role: UserRole;
  isFirstLogin: boolean;
  message: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  aadhaarNumber: string;
  phone: string;
}

export interface ChangePasswordRequest {
  email: string;
  oldPassword: string;
  newPassword: string;
}
