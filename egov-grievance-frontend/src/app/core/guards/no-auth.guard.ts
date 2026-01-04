import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DISABLE_GUARDS } from './guard-bypass';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (DISABLE_GUARDS) {
      return true; // ✅ app fully open
    }

    if (!this.authService.isAuthenticated()) {
      return true;
    }

    const dashboardRoute = this.authService.getDashboardRoute();
    this.router.navigate([dashboardRoute]);
    return false;
  }
}
