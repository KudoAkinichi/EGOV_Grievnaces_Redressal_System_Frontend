import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

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
    if (this.authService.isAuthenticated()) {
      // Check for first login - redirect to change password
      if (this.authService.isFirstLogin() && !url.includes('change-password')) {
        this.router.navigate(['/auth/change-password']);
        return false;
      }
      return true;
    }

    // Not authenticated - redirect to login
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: url },
    });
    return false;
  }
}
