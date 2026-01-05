// src/app/core/services/auth.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
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
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.initializeAuthState();
    }
  }

  /**
   * Initialize authentication state (BROWSER ONLY)
   */
  private initializeAuthState(): void {
    const token = this.storageService.getToken();

    if (token && !this.tokenService.isTokenExpired(token)) {
      this.isAuthenticatedSubject.next(true);
      this.loadCurrentUser().subscribe();
    } else {
      this.isAuthenticatedSubject.next(false);
    }
  }

  /**
   * ✅ SSR SAFE TOKEN ACCESS
   */
  getToken(): string | null {
    if (!this.isBrowser) return null;
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
        this.storageService.setToken(response.token);

        const userId = this.tokenService.getUserIdFromToken(response.token);
        if (userId) {
          this.storageService.setUserId(userId);
        }

        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  /**
   * Logout user
   */
  logout(navigate: boolean = true): void {
    const token = this.getToken();

    if (token) {
      this.http.post(`${this.AUTH_URL}/logout`, {}).subscribe({
        complete: () => this.clearAuthState(navigate),
        error: () => this.clearAuthState(navigate),
      });
    } else {
      this.clearAuthState(navigate);
    }
  }

  private clearAuthState(navigate: boolean): void {
    if (this.isBrowser) {
      this.storageService.clearAll();
    }

    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);

    if (navigate) {
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
        }
      }),
      map((res) => res.data),
      catchError(() => {
        this.logout(false);
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
