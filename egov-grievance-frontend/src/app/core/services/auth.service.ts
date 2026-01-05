// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, of, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import { TokenService } from './token.service';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ChangePasswordRequest,
  User,
  UserRole,
} from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_URL = `${environment.apiUrl}/auth`;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService,
    private tokenService: TokenService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeAuthState();
    }
  }

  /**
   * Initialize authentication state from stored data
   */
  private initializeAuthState(): void {
    const token = this.storageService.getToken();
    if (token && !this.tokenService.isTokenExpired(token)) {
      this.isAuthenticatedSubject.next(true);
      // Load user data
      this.loadCurrentUser().subscribe();
    } else {
      this.logout(false);
    }
  }

  /**
   * Register new citizen
   */
  register(request: RegisterRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.AUTH_URL}/register`, request);
  }

  /**
   * Login user
   */
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.AUTH_URL}/login`, request).pipe(
      tap((response) => {
        // Store token
        this.storageService.setToken(response.token);

        // Extract and store user ID from token
        const userId = this.tokenService.getUserIdFromToken(response.token);
        if (userId) {
          this.storageService.setUserId(userId);
        }

        this.isAuthenticatedSubject.next(true);

        // Load full user data
        this.loadCurrentUser().subscribe();
      })
    );
  }

  /**
   * Logout user
   */
  logout(navigate: boolean = true): void {
    const token = this.storageService.getToken();

    if (token) {
      // Call backend logout endpoint (optional)
      this.http.post(`${this.AUTH_URL}/logout`, {}).subscribe({
        complete: () => {
          this.clearAuthState(navigate);
        },
        error: () => {
          this.clearAuthState(navigate);
        },
      });
    } else {
      this.clearAuthState(navigate);
    }
  }

  /**
   * Clear authentication state
   */
  private clearAuthState(navigate: boolean): void {
    this.storageService.clearAll();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);

    if (navigate) {
      this.router.navigate(['/auth/login']);
    }
  }

  /**
   * Change password
   */
  changePassword(request: ChangePasswordRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.AUTH_URL}/change-password`, request);
  }

  /**
   * Validate token
   */
  validateToken(): Observable<boolean> {
    return this.http.get<ApiResponse<boolean>>(`${this.AUTH_URL}/validate`).pipe(
      map((response) => response.success),
      catchError(() => of(false))
    );
  }

  /**
   * Get current user from backend
   */
  loadCurrentUser(): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.AUTH_URL}/me`).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.storageService.setUser(response.data);
          this.currentUserSubject.next(response.data);
        }
      }),
      map((response) => response.data),
      catchError(() => {
        this.logout(false);
        return of(null as any);
      })
    );
  }

  /**
   * Get current user from memory/storage
   */
  getCurrentUser(): User | null {
    if (this.currentUserSubject.value) {
      return this.currentUserSubject.value;
    }
    return this.storageService.getUser<User>();
  }

  /**
   * Get current user role
   */
  getCurrentUserRole(): UserRole | null {
    const user = this.getCurrentUser();
    return user?.role || null;
  }

  /**
   * Get current user ID
   */
  getCurrentUserId(): number | null {
    const user = this.getCurrentUser();
    if (user?.id) {
      return user.id;
    }
    return this.storageService.getUserId();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.storageService.getToken();
    if (!token) {
      return false;
    }
    return !this.tokenService.isTokenExpired(token);
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: UserRole): boolean {
    return this.getCurrentUserRole() === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: UserRole[]): boolean {
    const userRole = this.getCurrentUserRole();
    return userRole ? roles.includes(userRole) : false;
  }

  /**
   * Check if this is user's first login
   */
  isFirstLogin(): boolean {
    const user = this.getCurrentUser();
    return user?.isFirstLogin || false;
  }

  /**
   * Get dashboard route based on user role
   */
  getDashboardRoute(): string {
    const role = this.getCurrentUserRole();
    switch (role) {
      case UserRole.CITIZEN:
        return '/citizen/dashboard';
      case UserRole.DEPT_OFFICER:
        return '/officer/dashboard';
      case UserRole.SUPERVISOR:
        return '/supervisor/dashboard';
      case UserRole.ADMIN:
        return '/admin/dashboard';
      default:
        return '/auth/login';
    }
  }
}
