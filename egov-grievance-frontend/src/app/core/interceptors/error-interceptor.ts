// src/app/core/interceptors/error-interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error) => {
      let errorMessage = 'An error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
        console.error('❌ Client Error:', error.error.message);
      } else {
        // Server-side error
        console.error('❌ Server Error:', {
          status: error.status,
          message: error.error?.message,
          url: req.url,
        });

        switch (error.status) {
          case 0:
            // Network error or CORS blocked
            errorMessage =
              'Network error. Please check if backend is running and CORS is configured.';
            console.error(
              '❌ CORS or Network Issue - Backend might be down or CORS not configured'
            );
            toastr.error(errorMessage, 'Connection Error');
            break;

          case 401:
            // Unauthorized - redirect to login
            errorMessage = error.error?.message || 'Unauthorized access. Please login again.';
            console.warn('⚠️ 401 - Redirecting to login');
            authService.logout(true);
            break;

          case 403:
            // Forbidden - access denied
            // ✅ FIX: Suppress 403 errors on logout endpoint
            if (req.url.includes('/auth/logout')) {
              console.warn('⚠️ Server returned 403 on logout (likely already logged out)');
              return throwError(() => ({
                status: 403,
                message: 'Already logged out',
                error: error.error,
              }));
            }
            errorMessage = error.error?.message || 'Access denied. You do not have permission.';
            console.warn('⚠️ 403 - Access Denied');
            router.navigate(['/access-denied']);
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
            errorMessage = error.error?.message || 'Internal server error. Please try again later.';
            console.error('❌ 500 - Server Error');
            break;

          default:
            errorMessage =
              error.error?.message || `Error Code: ${error.status}\n${error.statusText}`;
        }
      }

      console.error('HTTP Error Summary:', {
        status: error.status,
        message: errorMessage,
        url: req.url,
      });

      return throwError(() => ({
        status: error.status,
        message: errorMessage,
        error: error.error,
      }));
    })
  );
};
