// src/app/core/interceptors/jwt-interceptor.ts
import { Injectable, inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);
  const authService = inject(AuthService);

  // Skip interceptor for auth endpoints
  const isAuthEndpoint =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register') ||
    req.url.includes('/auth/logout');

  if (isAuthEndpoint) {
    return next(req);
  }

  // Get token and user info
  const token = storageService.getToken();
  const userId = storageService.getUserId();
  const user = authService.getCurrentUser();

  // Clone request and add headers
  if (token) {
    let clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Add X-User-Id header
    if (userId) {
      clonedReq = clonedReq.clone({
        setHeaders: {
          'X-User-Id': userId.toString(),
        },
      });
    }

    // Add X-User-Role header
    if (user?.role) {
      clonedReq = clonedReq.clone({
        setHeaders: {
          'X-User-Role': user.role,
        },
      });
    }

    // ✅ Add X-Department-ID header for supervisor
    if (user?.departmentId) {
      clonedReq = clonedReq.clone({
        setHeaders: {
          'X-Department-ID': user.departmentId.toString(),
        },
      });
    }

    console.log('✅ JWT Interceptor - Added headers');

    return next(clonedReq);
  }

  return next(req);
};
