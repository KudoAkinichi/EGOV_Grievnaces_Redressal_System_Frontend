import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../../core/models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class NavbarComponent {
  @Output() sidenavToggle = new EventEmitter<void>();

  currentUser: User | null = null;
  UserRole = UserRole;
  isLoggingOut = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  toggleSidenav(): void {
    this.sidenavToggle.emit();
  }

  logout(): void {
    this.isLoggingOut = true;
    console.log('🔴 User clicked logout button');

    // This will clear localStorage and navigate to login
    this.authService.logout(true);

    // Show feedback
    this.toastr.success('Logged out successfully', 'Goodbye!');
  }

  navigateToProfile(): void {
    // Navigate to profile page based on role
    const role = this.authService.getCurrentUserRole();
    switch (role) {
      case UserRole.CITIZEN:
        this.router.navigate(['/citizen/profile']);
        break;
      case UserRole.DEPT_OFFICER:
        this.router.navigate(['/officer/profile']);
        break;
      case UserRole.SUPERVISOR:
        this.router.navigate(['/supervisor/profile']);
        break;
      case UserRole.ADMIN:
        this.router.navigate(['/admin/profile']);
        break;
    }
  }

  navigateToSettings(): void {
    this.router.navigate(['/auth/change-password']);
  }
}
