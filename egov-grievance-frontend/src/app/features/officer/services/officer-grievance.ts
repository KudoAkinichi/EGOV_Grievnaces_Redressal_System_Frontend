// src/app/features/officer/services/officer-grievance.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import {
  ApiResponse,
  Grievance,
  OfficerDashboardStats,
  UpdateGrievanceStatusRequest,
  UploadDocumentRequest,
  GrievanceDocument,
  StatusHistory,
  GrievanceComment,
} from '../../../core/models';

@Injectable({
  providedIn: 'root',
})
export class OfficerGrievanceService {
  private readonly GRIEVANCE_URL = `${environment.apiUrl}/grievances`;

  constructor(private http: HttpClient) {}

  // ================= DASHBOARD =================

  getOfficerDashboard(officerId: number): Observable<ApiResponse<OfficerDashboardStats>> {
    const params = new HttpParams().set('officerId', officerId.toString());

    return this.http.get<ApiResponse<OfficerDashboardStats>>(
      `${this.GRIEVANCE_URL}/dashboard/officer`,
      { params }
    );
  }

  // ================= GRIEVANCE LIST (IMPORTANT) =================
  // Backend has NO /assigned endpoint
  // So we fetch all grievances and filter by assignedOfficerId in frontend

  getAllGrievances(status?: string, page = 0, size = 20): Observable<ApiResponse<any>> {
    let params = new HttpParams().set('page', page).set('size', size);

    if (status && status !== 'all') {
      params = params.set('status', status);
    }

    return this.http.get<ApiResponse<any>>(`${this.GRIEVANCE_URL}`, { params });
  }

  getDepartmentGrievances(
    page = 0,
    size = 1000
  ): Observable<ApiResponse<{ content: Grievance[] }>> {
    return this.http.get<ApiResponse<{ content: Grievance[] }>>(`${this.GRIEVANCE_URL}`, {
      params: {
        page,
        size,
      },
    });
  }

  // ================= SINGLE GRIEVANCE =================

  getGrievanceById(id: number): Observable<ApiResponse<Grievance>> {
    return this.http.get<ApiResponse<Grievance>>(`${this.GRIEVANCE_URL}/${id}`);
  }

  updateGrievanceStatus(
    id: number,
    request: UpdateGrievanceStatusRequest
  ): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(`${this.GRIEVANCE_URL}/${id}/status`, request);
  }

  // ================= DOCUMENTS =================

  uploadDocument(
    grievanceId: number,
    request: UploadDocumentRequest
  ): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.GRIEVANCE_URL}/${grievanceId}/documents`,
      request
    );
  }

  getGrievanceDocuments(grievanceId: number): Observable<ApiResponse<GrievanceDocument[]>> {
    return this.http.get<ApiResponse<GrievanceDocument[]>>(
      `${this.GRIEVANCE_URL}/${grievanceId}/documents`
    );
  }

  // ================= HISTORY & COMMENTS =================

  getStatusHistory(grievanceId: number): Observable<ApiResponse<StatusHistory[]>> {
    return this.http.get<ApiResponse<StatusHistory[]>>(
      `${this.GRIEVANCE_URL}/${grievanceId}/history`
    );
  }

  getGrievanceComments(grievanceId: number): Observable<ApiResponse<GrievanceComment[]>> {
    return this.http.get<ApiResponse<GrievanceComment[]>>(
      `${this.GRIEVANCE_URL}/${grievanceId}/comments`
    );
  }

  addComment(
    grievanceId: number,
    request: { message: string; isInternal: boolean }
  ): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.GRIEVANCE_URL}/${grievanceId}/comments`,
      request
    );
  }
}
