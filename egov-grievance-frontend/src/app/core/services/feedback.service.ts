import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  Feedback,
  CreateFeedbackRequest,
  FeedbackStats,
} from '../../core/models/index';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private readonly FEEDBACK_URL = `${environment.apiUrl}/feedbacks`;

  constructor(private http: HttpClient) {}

  submitFeedback(request: CreateFeedbackRequest): Observable<ApiResponse<Feedback>> {
    return this.http.post<ApiResponse<Feedback>>(this.FEEDBACK_URL, request);
  }

  getFeedbackByGrievanceId(grievanceId: number): Observable<ApiResponse<Feedback>> {
    return this.http.get<ApiResponse<Feedback>>(`${this.FEEDBACK_URL}/grievance/${grievanceId}`);
  }

  checkFeedbackExists(grievanceId: number): Observable<ApiResponse<boolean>> {
    return this.http.get<ApiResponse<boolean>>(
      `${this.FEEDBACK_URL}/grievance/${grievanceId}/exists`
    );
  }

  getMyFeedbacks(): Observable<ApiResponse<Feedback[]>> {
    return this.http.get<ApiResponse<Feedback[]>>(`${this.FEEDBACK_URL}/my-feedbacks`);
  }

  getFeedbackStats(): Observable<ApiResponse<FeedbackStats>> {
    return this.http.get<ApiResponse<FeedbackStats>>(`${this.FEEDBACK_URL}/stats`);
  }

  getStarArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }
}
