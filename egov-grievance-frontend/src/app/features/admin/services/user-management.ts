// src/app/features/admin/services/user-management.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, Page, User, UserRole } from '../../../core/models/index';

export interface CreateOfficerRequest {
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  departmentId: number;
}

export interface CreateOfficerResponse {
  userId: number;
  email: string;
  temporaryPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private readonly BASE_URL = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(page: number = 0, size: number = 10): Observable<ApiResponse<Page<User>>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    console.log('📥 Fetching users - page:', page);
    return this.http.get<ApiResponse<Page<User>>>(this.BASE_URL, { params });
  }

  getUserById(userId: number): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.BASE_URL}/${userId}`);
  }

  createOfficer(request: CreateOfficerRequest): Observable<ApiResponse<CreateOfficerResponse>> {
    console.log('📤 Creating officer:', request.email);
    return this.http.post<ApiResponse<CreateOfficerResponse>>(`${this.BASE_URL}/officers`, request);
  }

  assignRole(userId: number, role: UserRole): Observable<ApiResponse<any>> {
    console.log('📤 Assigning role to user:', userId);
    return this.http.put<ApiResponse<any>>(`${this.BASE_URL}/${userId}/role`, { role });
  }

  assignDepartment(userId: number, departmentId: number): Observable<ApiResponse<any>> {
    console.log('📤 Assigning department to user:', userId);
    return this.http.put<ApiResponse<any>>(`${this.BASE_URL}/${userId}/department`, {
      departmentId,
    });
  }

  deleteUser(userId: number): Observable<ApiResponse<any>> {
    console.log('📤 Deleting user:', userId);
    return this.http.delete<ApiResponse<any>>(`${this.BASE_URL}/${userId}`);
  }

  getUsersByRole(role: UserRole): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.BASE_URL}/by-role/${role}`);
  }

  getUsersByDepartment(departmentId: number): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.BASE_URL}/by-department/${departmentId}`);
  }
}
