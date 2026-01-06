// src/app/features/supervisor/services/supervisor-dashboard.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';

export interface SupervisorDashboardStats {
  total: number;
  escalated: number;
  resolved: number;
  assigned: number;
  inReview: number;
  openIssues: number;
}

@Injectable({ providedIn: 'root' })
export class SupervisorDashboardService {
  private readonly BASE_URL = `${environment.apiUrl}/supervisor/grievances`;
  private readonly GRIEVANCE_URL = `${environment.apiUrl}/grievances`;

  constructor(private http: HttpClient) {}

  /**
   * Get dashboard stats for supervisor
   * Fetches all grievances and counts by status
   */
  getDashboardStats(departmentId: number): Observable<ApiResponse<SupervisorDashboardStats>> {
    const params = new HttpParams().set('departmentId', departmentId.toString());

    console.log(`📊 Fetching dashboard stats for department: ${departmentId}`);

    // Use the /all endpoint to get all grievances, then calculate stats
    return new Observable((observer) => {
      this.http.get<ApiResponse<any>>(`${this.BASE_URL}/all`, { params }).subscribe({
        next: (res) => {
          console.log('📥 Dashboard API Response:', res);

          if (res.success && res.data) {
            const grievances = res.data.content || [];

            // Calculate stats from the data
            const stats: SupervisorDashboardStats = {
              total: res.data.totalElements || grievances.length,
              escalated: grievances.filter((g: any) => g.status === 'ESCALATED').length,
              resolved: grievances.filter((g: any) => g.status === 'RESOLVED').length,
              assigned: grievances.filter((g: any) => g.status === 'ASSIGNED').length,
              inReview: grievances.filter((g: any) => g.status === 'IN_REVIEW').length,
              openIssues: grievances.filter(
                (g: any) => g.status !== 'RESOLVED' && g.status !== 'CLOSED'
              ).length,
            };

            console.log('📊 Calculated Stats:', stats);
            observer.next({
              success: true,
              data: stats,
              message: 'Stats calculated',
            });
          } else {
            observer.error('No data received');
          }
        },
        error: (err) => {
          console.error('❌ Dashboard stats error:', err);
          observer.error(err);
        },
      });
    });
  }
}
