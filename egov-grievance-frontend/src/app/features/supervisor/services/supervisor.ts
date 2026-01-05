// src/app/features/supervisor/services/supervisor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { ApiResponse, Grievance, User } from '../../../core/models/index';

@Injectable({
  providedIn: 'root',
})
export class SupervisorService {
  private readonly GRIEVANCE_URL = `${environment.apiUrl}/grievances`;
  private readonly USER_URL = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  // ================= ESCALATIONS =================

  /**
   * Fetch escalated grievances (Supervisor view)
   */
  getEscalatedGrievances(page: number = 0, size: number = 10): Observable<ApiResponse<any>> {
    const params = new HttpParams().set('status', 'ESCALATED').set('page', page).set('size', size);

    return this.http.get<ApiResponse<any>>(this.GRIEVANCE_URL, { params });
  }

  // ================= ASSIGNMENT =================

  /**
   * Get officers of a department for assignment
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

  // getAllGrievances(page: number = 0, size: number = 10): Observable<ApiResponse<any>> {
  //   const params = new HttpParams().set('page', page).set('size', size);

  //   return this.http.get<ApiResponse<any>>(`${environment.apiUrl}/grievances`, { params });
  // }

  getAllGrievances(page = 0, size = 10) {
    const params = new HttpParams().set('page', page).set('size', size);

    return this.http.get<any>(`${environment.apiUrl}/grievances`, { params });
  }

  getGrievancesByStatus(status: string, page = 0, size = 10) {
    const params = new HttpParams().set('status', status).set('page', page).set('size', size);

    return this.http.get<any>(`${environment.apiUrl}/grievances`, { params });
  }

  getGrievanceById(id: number) {
    return this.http.get<any>(`${environment.apiUrl}/grievances/${id}`);
  }
}
