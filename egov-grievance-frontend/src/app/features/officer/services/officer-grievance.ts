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
} from '../../../core/models/index';

@Injectable({
  providedIn: 'root',
})
export class OfficerGrievanceService {
  private readonly GRIEVANCE_URL = `${environment.apiUrl}/grievances`;

  constructor(private http: HttpClient) {}
  getOfficerDashboard(officerId: number): Observable<ApiResponse<OfficerDashboardStats>> {
    const params = new HttpParams().set('officerId', officerId.toString());
    return this.http.get<ApiResponse<OfficerDashboardStats>>(
      `${this.GRIEVANCE_URL}/dashboard/officer`,
      { params }
    );
  }

  getAssignedGrievances(): Observable<ApiResponse<Grievance[]>> {
    return this.http.get<ApiResponse<Grievance[]>>(`${this.GRIEVANCE_URL}/assigned`);
  }

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
  ): Observable<ApiResponse<GrievanceDocument>> {
    return this.http.post<ApiResponse<GrievanceDocument>>(
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
