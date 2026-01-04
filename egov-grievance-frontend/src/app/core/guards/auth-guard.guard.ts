import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DISABLE_GUARDS } from './guard-bypass';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkAuth(state.url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkAuth(state.url);
  }

  private checkAuth(url: string): boolean {
    if (DISABLE_GUARDS) {
      return true; // ✅ allow all routes
    }

    if (this.authService.isAuthenticated()) {
      if (this.authService.isFirstLogin() && !url.includes('change-password')) {
        this.router.navigate(['/auth/change-password']);
        return false;
      }
      return true;
    }

    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: url },
    });
    return false;
  }
}
