import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';
import { ChangePasswordRequest } from '../../../core/models/user.model';

@Component({
  selector: 'app-change-password',
  standalone: false,
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.scss'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  loading = false;
  hideOldPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  isFirstLogin = false;
  userEmail = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.checkFirstLogin();
    this.initForm();
  }

  checkFirstLogin(): void {
    this.isFirstLogin = this.authService.isFirstLogin();
    const user = this.authService.getCurrentUser();
    this.userEmail = user?.email || '';

    if (!this.isFirstLogin && !this.authService.isAuthenticated()) {
      // Not authenticated and not first login - redirect to login
      this.router.navigate(['/auth/login']);
    }
  }

  initForm(): void {
    this.changePasswordForm = this.fb.group(
      {
        oldPassword: ['', [Validators.required]],
        newPassword: [
          '',
          [Validators.required, Validators.minLength(8), this.passwordStrengthValidator],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  get f() {
    return this.changePasswordForm.controls;
  }

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

    return passwordValid ? null : { weakPassword: true };
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (!newPassword || !confirmPassword) return null;

    return newPassword.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const request: ChangePasswordRequest = {
      email: this.userEmail,
      oldPassword: this.changePasswordForm.value.oldPassword,
      newPassword: this.changePasswordForm.value.newPassword,
    };

    this.authService.changePassword(request).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.toastr.success(
            'Password changed successfully! Please login with new password.',
            'Success'
          );

          // Logout and redirect to login
          this.authService.logout(true);
        } else {
          this.toastr.error(response.message, 'Error');
        }
      },
      error: (error) => {
        this.loading = false;
        this.toastr.error(error.message || 'Failed to change password. Please try again.', 'Error');
      },
    });
  }

  onCancel(): void {
    if (this.isFirstLogin) {
      // First login - must change password, logout
      this.authService.logout(true);
    } else {
      // Regular password change - go back to dashboard
      const dashboardRoute = this.authService.getDashboardRoute();
      this.router.navigate([dashboardRoute]);
    }
  }
}
