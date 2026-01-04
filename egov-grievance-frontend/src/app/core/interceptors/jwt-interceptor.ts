import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private storageService: StorageService, private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip interceptor for auth endpoints
    const isAuthEndpoint =
      request.url.includes('/auth/login') || request.url.includes('/auth/register');

    if (isAuthEndpoint) {
      return next.handle(request);
    }

    // Get token and user ID from storage
    const token = this.storageService.getToken();
    const userId = this.storageService.getUserId();
    const user = this.authService.getCurrentUser();

    // Clone request and add headers
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Add X-User-Id header if available
      if (userId) {
        request = request.clone({
          setHeaders: {
            'X-User-Id': userId.toString(),
          },
        });
      }

      // Add X-User-Role header if available
      if (user?.role) {
        request = request.clone({
          setHeaders: {
            'X-User-Role': user.role,
          },
        });
      }
    }

    return next.handle(request);
  }
}
