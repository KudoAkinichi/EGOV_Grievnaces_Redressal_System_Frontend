import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          switch (error.status) {
            case 401:
              // Unauthorized - redirect to login
              errorMessage = error.error?.message || 'Unauthorized access. Please login again.';
              this.authService.logout(true);
              break;

            case 403:
              // Forbidden - access denied
              errorMessage = error.error?.message || 'Access denied. You do not have permission.';
              this.router.navigate(['/access-denied']);
              break;

            case 404:
              // Not found
              errorMessage = error.error?.message || 'Resource not found.';
              break;

            case 400:
              // Bad request - validation errors
              if (error.error?.fieldErrors) {
                const fieldErrors = error.error.fieldErrors;
                errorMessage = Object.values(fieldErrors).join(', ');
              } else {
                errorMessage = error.error?.message || 'Invalid request.';
              }
              break;

            case 500:
              // Internal server error
              errorMessage =
                error.error?.message || 'Internal server error. Please try again later.';
              break;

            case 0:
              // Network error
              errorMessage = 'Network error. Please check your internet connection.';
              break;

            default:
              errorMessage = error.error?.message || `Error Code: ${error.status}`;
          }
        }

        console.error('HTTP Error:', {
          status: error.status,
          message: errorMessage,
          error: error.error,
        });

        return throwError(() => ({
          status: error.status,
          message: errorMessage,
          error: error.error,
        }));
      })
    );
  }
}
