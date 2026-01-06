// src/app/core/services/auth.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, of, map, timeout, finalize } from 'rxjs';
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
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_URL = `${environment.apiUrl}/auth`;
  private readonly isBrowser: boolean;

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
    // ✅ Initialize isBrowser property
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.initializeAuthState();
    }
  }

  /**
   * Initialize authentication state (BROWSER ONLY)
   * Restores session on app reload - TOKEN STAYS IN LOCALSTORAGE
   */
  private initializeAuthState(): void {
    const token = this.storageService.getToken();
    const storedUser = this.storageService.getUser<User>();

    if (token && !this.tokenService.isTokenExpired(token)) {
      console.log('✅ Valid token found in localStorage, restoring session');
      this.isAuthenticatedSubject.next(true);

      // ✅ Restore user immediately from storage if available
      if (storedUser) {
        this.currentUserSubject.next(storedUser);
      }

      // Then refresh user data from server in background (non-blocking)
      this.loadCurrentUser().subscribe({
        error: (err) => {
          console.warn('⚠️ Failed to refresh user data on init:', err.message);
          // Keep the stored user even if refresh fails - session continues
        },
      });
    } else if (token && this.tokenService.isTokenExpired(token)) {
      console.log('⚠️ Token expired, clearing session');
      this.clearAuthState(false); // Don't navigate, just clear state
    } else {
      console.log('ℹ️ No token found');
      this.isAuthenticatedSubject.next(false);
      this.currentUserSubject.next(null);
    }
  }

  /**
   * ✅ SSR SAFE TOKEN ACCESS
   */
  getToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    return this.storageService.getToken();
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
        // ✅ Store token in localStorage (persists on reload)
        this.storageService.setToken(response.token);

        const userId = this.tokenService.getUserIdFromToken(response.token);
        if (userId) {
          this.storageService.setUserId(userId);
        }

        this.isAuthenticatedSubject.next(true);
        console.log('✅ Login successful, token stored in localStorage');
      }),
      catchError((error) => {
        console.error('❌ Login failed:', error.message);
        throw error;
      })
    );
  }

  /**
   * ⚠️ ONLY CLEARS TOKEN ON EXPLICIT LOGOUT BUTTON CLICK
   * Routes user back to login/signup page
   */
  logout(navigate: boolean = true): void {
    const token = this.getToken();

    console.log('🔴 Logout initiated, clearing token from localStorage');

    if (token) {
      // Try to notify server but use timeout to avoid waiting
      // If server is slow or returns 403, don't block logout
      this.http
        .post(`${this.AUTH_URL}/logout`, {})
        .pipe(
          timeout(5000), // Wait max 5 seconds
          catchError((error) => {
            // Log error but don't throw - logout should proceed regardless
            if (error instanceof HttpErrorResponse && error.status === 403) {
              console.warn('⚠️ Server returned 403 on logout endpoint (likely already logged out)');
            } else {
              console.warn('⚠️ Logout notification failed:', error.message);
            }
            return of(null); // Continue with local logout
          })
        )
        .subscribe(() => {
          this.clearAuthState(navigate);
        });
    } else {
      // No token, just clear state and redirect
      this.clearAuthState(navigate);
    }
  }

  /**
   * Clears all auth state from memory and localStorage
   * Routes to login if navigate = true
   */
  private clearAuthState(navigate: boolean): void {
    // ✅ Clear from localStorage ONLY
    if (this.isBrowser) {
      this.storageService.clearAll();
      console.log('✅ localStorage cleared');
    }

    // Clear from memory
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);

    // Navigate to auth page if requested
    if (navigate) {
      console.log('🔄 Navigating to login page');
      this.router.navigate(['/auth/login']);
    }
  }

  changePassword(request: ChangePasswordRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.AUTH_URL}/change-password`, request);
  }

  validateToken(): Observable<boolean> {
    return this.http.get<ApiResponse<boolean>>(`${this.AUTH_URL}/validate`).pipe(
      map((res) => res.success),
      catchError(() => of(false))
    );
  }

  loadCurrentUser(): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.AUTH_URL}/me`).pipe(
      tap((res) => {
        if (res.success && res.data && this.isBrowser) {
          this.storageService.setUser(res.data);
          this.currentUserSubject.next(res.data);
          console.log('✅ User data loaded:', res.data.email);
        }
      }),
      map((res) => res.data),
      catchError((err) => {
        console.error('❌ Failed to load user data:', err);
        // Don't logout on loadCurrentUser failure - just return null
        return of(null as any);
      })
    );
  }

  getCurrentUser(): User | null {
    if (this.currentUserSubject.value) {
      return this.currentUserSubject.value;
    }

    if (!this.isBrowser) return null;
    return this.storageService.getUser<User>();
  }

  getCurrentUserRole(): UserRole | null {
    const user = this.getCurrentUser();
    if (user?.role) return user.role;

    const token = this.getToken();
    if (!token) return null;

    return this.tokenService.getRoleFromToken(token);
  }

  getCurrentUserId(): number | null {
    const user = this.getCurrentUser();
    if (user?.id) return user.id;

    return this.isBrowser ? this.storageService.getUserId() : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.tokenService.isTokenExpired(token) : false;
  }

  hasRole(role: UserRole): boolean {
    return this.getCurrentUserRole() === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const role = this.getCurrentUserRole();
    return role ? roles.includes(role) : false;
  }

  isFirstLogin(): boolean {
    return this.getCurrentUser()?.isFirstLogin || false;
  }

  getDashboardRoute(): string {
    switch (this.getCurrentUserRole()) {
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
