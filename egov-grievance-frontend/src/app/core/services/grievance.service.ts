import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  PageResponse,
  Grievance,
  CreateGrievanceRequest,
  UpdateGrievanceStatusRequest,
  GrievanceDocument,
  UploadDocumentRequest,
  GrievanceComment,
  CreateCommentRequest,
  StatusHistory,
  CitizenDashboardStats,
  Department,
  Category,
  GrievanceStatus,
} from '../../core/models/index';
import { DocumentViewerComponent } from '../../shared/components/DocumentViewer/DocumentViewerData';

@Injectable({
  providedIn: 'root',
})
export class GrievanceService {
  private readonly GRIEVANCE_URL = `${environment.apiUrl}/grievances`;
  private readonly DEPARTMENT_URL = `${environment.apiUrl}/departments`;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // ================= Grievance CRUD =================

  createGrievance(request: CreateGrievanceRequest): Observable<ApiResponse<Grievance>> {
    return this.http.post<ApiResponse<Grievance>>(this.GRIEVANCE_URL, request);
  }

  getMyGrievances(
    page: number = 0,
    size: number = 10
  ): Observable<ApiResponse<PageResponse<Grievance>>> {
    const params = new HttpParams().set('page', page).set('size', size);

    return this.http.get<ApiResponse<PageResponse<Grievance>>>(
      `${this.GRIEVANCE_URL}/my-grievances`,
      { params }
    );
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

  escalateGrievance(id: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.GRIEVANCE_URL}/${id}/escalate`, {});
  }

  withdrawGrievance(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.GRIEVANCE_URL}/${id}`);
  }

  // ================= Documents =================

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

  deleteDocument(docId: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.GRIEVANCE_URL}/documents/${docId}`);
  }

  // ================= Comments =================

  addComment(grievanceId: number, request: CreateCommentRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.GRIEVANCE_URL}/${grievanceId}/comments`,
      request
    );
  }

  getGrievanceComments(grievanceId: number): Observable<ApiResponse<GrievanceComment[]>> {
    return this.http.get<ApiResponse<GrievanceComment[]>>(
      `${this.GRIEVANCE_URL}/${grievanceId}/comments`
    );
  }

  // ================= History =================

  getStatusHistory(grievanceId: number): Observable<ApiResponse<StatusHistory[]>> {
    return this.http.get<ApiResponse<StatusHistory[]>>(
      `${this.GRIEVANCE_URL}/${grievanceId}/history`
    );
  }

  // ================= Dashboard =================

  getCitizenDashboardStats(): Observable<CitizenDashboardStats> {
    return this.getMyGrievances(0, 1000).pipe(
      map((response) => {
        const grievances = response.data.content;

        return {
          totalGrievances: grievances.length,
          submitted: grievances.filter((g) => g.status === GrievanceStatus.SUBMITTED).length,
          assigned: grievances.filter((g) => g.status === GrievanceStatus.ASSIGNED).length,
          inReview: grievances.filter((g) => g.status === GrievanceStatus.IN_REVIEW).length,
          resolved: grievances.filter((g) => g.status === GrievanceStatus.RESOLVED).length,
          closed: grievances.filter((g) => g.status === GrievanceStatus.CLOSED).length,
          escalated: grievances.filter((g) => g.status === GrievanceStatus.ESCALATED).length,
        };
      })
    );
  }

  // ================= Department =================

  getAllDepartments(): Observable<ApiResponse<Department[]>> {
    return this.http.get<ApiResponse<Department[]>>(this.DEPARTMENT_URL);
  }

  getDepartmentCategories(departmentId: number): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(
      `${this.DEPARTMENT_URL}/${departmentId}/categories`
    );
  }

  getAllCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${this.DEPARTMENT_URL}/categories`);
  }

  // ================= Utilities (SSR SAFE) =================

  viewDocument(doc: GrievanceDocument): void {
    this.dialog.open(DocumentViewerComponent, {
      data: { document: doc },
      width: '90vw',
      height: '90vh',
      maxWidth: '1200px',
    });
  }

  downloadDocument(doc: GrievanceDocument): void {
    const linkSource = `data:${doc.fileType};base64,${doc.fileDataBase64}`;
    const link = document.createElement('a');
    link.href = linkSource;
    link.download = doc.fileName;
    link.click();
  }

  getDocumentPreviewUrl(doc: GrievanceDocument): string {
    if (!isPlatformBrowser(this.platformId)) return '';
    return `data:${doc.fileType};base64,${doc.fileDataBase64}`;
  }

  isImageFile(fileType: string): boolean {
    return fileType.startsWith('image/');
  }

  isPdfFile(fileType: string): boolean {
    return fileType === 'application/pdf';
  }
}
