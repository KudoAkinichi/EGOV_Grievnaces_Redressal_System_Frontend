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
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(): Observable<boolean> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(true);
    }

    return this.authService.isAuthenticated$.pipe(
      take(1),
      tap((isAuth) => {
        if (!isAuth) {
          console.warn('AuthGuard blocked route, redirecting to login');
          this.router.navigate(['/auth/login']);
        }
      })
    );
  }
}
