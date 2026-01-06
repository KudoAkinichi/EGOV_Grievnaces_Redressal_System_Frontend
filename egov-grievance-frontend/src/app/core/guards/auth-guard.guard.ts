import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of, take, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(): Observable<boolean> | boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }

    return this.checkAuth();
  }

  canActivateChild(): Observable<boolean> | boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }

    return this.checkAuth();
  }

  private checkAuth(): Observable<boolean> {
    // ✅ Direct token check for faster response
    if (this.authService.isAuthenticated()) {
      return of(true);
    }

    // Also check BehaviorSubject state
    return this.authService.isAuthenticated$.pipe(
      take(1),
      tap((isAuth) => {
        if (!isAuth) {
          console.warn('❌ AuthGuard: Not authenticated, redirecting to login');
          this.router.navigate(['/auth/login']);
        }
      })
    );
  }
}
