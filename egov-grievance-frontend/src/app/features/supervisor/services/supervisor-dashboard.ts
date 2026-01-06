// src/app/features/supervisor/services/supervisor-dashboard.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';

// ✅ Updated interface with all required properties
export interface SupervisorDashboardStats {
  total: number;
  escalated: number;
  resolved: number;
  assigned: number; // ✅ Added
  inReview: number; // ✅ Added
  openIssues: number; // ✅ Added
}

@Injectable({ providedIn: 'root' })
export class SupervisorDashboardService {
  private readonly GRIEVANCE_URL = `${environment.apiUrl}/grievances`;

  constructor(private http: HttpClient) {}

  getDashboardStats(departmentId: number): Observable<ApiResponse<SupervisorDashboardStats>> {
    const params = new HttpParams().set('departmentId', departmentId.toString());

    return this.http.get<ApiResponse<SupervisorDashboardStats>>(
      `${this.GRIEVANCE_URL}/reports/by-department`,
      { params }
    );
  }
}
