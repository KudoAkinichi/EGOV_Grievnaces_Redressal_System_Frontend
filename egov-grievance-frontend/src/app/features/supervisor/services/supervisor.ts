// src/app/features/supervisor/services/supervisor.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, Page, Grievance, User } from '../../../core/models/index';

@Injectable({
  providedIn: 'root',
})
export class SupervisorService {
  private readonly BASE_URL = `${environment.apiUrl}/supervisor/grievances`;
  private readonly GRIEVANCE_URL = `${environment.apiUrl}/grievances`;
  private readonly USER_URL = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  /**
   * Get all grievances - NO FILTER
   */
  getAllDepartmentGrievances(
    page: number = 0,
    size: number = 10
  ): Observable<ApiResponse<Page<Grievance>>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    console.log(`📥 GET ${this.BASE_URL}/all`);
    return this.http.get<ApiResponse<Page<Grievance>>>(`${this.BASE_URL}/all`, { params });
  }

  /**
   * Get ESCALATED grievances only
   */
  getEscalatedGrievances(
    page: number = 0,
    size: number = 10
  ): Observable<ApiResponse<Page<Grievance>>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    console.log(`📥 GET ${this.BASE_URL}/escalated`);
    return this.http.get<ApiResponse<Page<Grievance>>>(`${this.BASE_URL}/escalated`, { params });
  }

  /**
   * Get ASSIGNED grievances only
   */
  getAssignedGrievances(
    page: number = 0,
    size: number = 10
  ): Observable<ApiResponse<Page<Grievance>>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    console.log(`📥 GET ${this.BASE_URL}/assigned`);
    return this.http.get<ApiResponse<Page<Grievance>>>(`${this.BASE_URL}/assigned`, { params });
  }

  /**
   * Get IN-REVIEW grievances only
   */
  getInReviewGrievances(
    page: number = 0,
    size: number = 10
  ): Observable<ApiResponse<Page<Grievance>>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    console.log(`📥 GET ${this.BASE_URL}/in-review`);
    return this.http.get<ApiResponse<Page<Grievance>>>(`${this.BASE_URL}/in-review`, { params });
  }

  /**
   * Get with status filter
   */
  getDepartmentGrievances(
    status?: string,
    page: number = 0,
    size: number = 10
  ): Observable<ApiResponse<Page<Grievance>>> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (status && status !== 'all') {
      params = params.set('status', status);
    }

    return this.http.get<ApiResponse<Page<Grievance>>>(this.BASE_URL, { params });
  }

  /**
   * Get grievance by ID
   */
  getGrievanceById(id: number): Observable<ApiResponse<Grievance>> {
    return this.http.get<ApiResponse<Grievance>>(`${this.BASE_URL}/${id}`);
  }

  /**
   * Get officers for assignment
   */
  getDepartmentOfficers(departmentId: number): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.USER_URL}/by-department/${departmentId}`);
  }

  /**
   * Assign grievance to officer
   */
  assignGrievance(grievanceId: number, officerId: number): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(
      `${this.GRIEVANCE_URL}/${grievanceId}/assign/${officerId}`,
      {}
    );
  }

  /**
   * Update status
   */
  updateGrievanceStatus(grievanceId: number, status: string): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(`${this.GRIEVANCE_URL}/${grievanceId}/status`, {
      status,
    });
  }

  /**
   * Escalate
   */
  escalateGrievance(grievanceId: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.GRIEVANCE_URL}/${grievanceId}/escalate`, {});
  }
}
