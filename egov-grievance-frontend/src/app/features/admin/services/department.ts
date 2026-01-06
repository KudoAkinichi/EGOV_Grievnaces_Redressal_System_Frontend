// src/app/features/admin/services/department.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';

export interface Department {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  departmentId: number;
}

export interface CreateDepartmentRequest {
  name: string;
  description: string;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private readonly BASE_URL = `${environment.apiUrl}/departments`;

  constructor(private http: HttpClient) {}

  getAllDepartments(): Observable<ApiResponse<Department[]>> {
    console.log('📥 Fetching all departments');
    return this.http.get<ApiResponse<Department[]>>(this.BASE_URL);
  }

  getDepartmentById(id: number): Observable<ApiResponse<Department>> {
    return this.http.get<ApiResponse<Department>>(`${this.BASE_URL}/${id}`);
  }

  createDepartment(request: CreateDepartmentRequest): Observable<ApiResponse<Department>> {
    console.log('📤 Creating department:', request);
    return this.http.post<ApiResponse<Department>>(this.BASE_URL, request);
  }

  updateDepartment(
    id: number,
    request: CreateDepartmentRequest
  ): Observable<ApiResponse<Department>> {
    console.log('📤 Updating department:', id, request);
    return this.http.put<ApiResponse<Department>>(`${this.BASE_URL}/${id}`, request);
  }

  deleteDepartment(id: number): Observable<ApiResponse<any>> {
    console.log('📤 Deleting department:', id);
    return this.http.delete<ApiResponse<any>>(`${this.BASE_URL}/${id}`);
  }

  getDepartmentCategories(departmentId: number): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${this.BASE_URL}/${departmentId}/categories`);
  }

  createCategory(
    departmentId: number,
    request: CreateCategoryRequest
  ): Observable<ApiResponse<Category>> {
    console.log('📤 Creating category for department:', departmentId);
    return this.http.post<ApiResponse<Category>>(
      `${this.BASE_URL}/${departmentId}/categories`,
      request
    );
  }

  getAllCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${this.BASE_URL}/categories`);
  }
}
