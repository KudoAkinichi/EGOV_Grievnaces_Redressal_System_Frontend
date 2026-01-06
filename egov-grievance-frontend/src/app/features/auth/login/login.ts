import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/user.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  loading = false;
  hidePassword = true;
  returnUrl = '';
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toastr.error('Please fill all required fields correctly', 'Validation Error');
      return;
    }

    this.loading = true;
    const loginRequest: LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    console.log('🔄 Attempting login for:', loginRequest.email);

    this.authService
      .login(loginRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('✅ Login response received:', response.role);
          this.toastr.success(response.message || 'Login successful!', 'Success');

          if (response.isFirstLogin) {
            this.loading = false;
            this.router.navigate(['/auth/change-password']);
            return;
          }

          // ✅ WAIT FOR USER TO LOAD
          this.authService
            .loadCurrentUser()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (user) => {
                this.loading = false;
                if (user) {
                  const dashboardRoute = this.authService.getDashboardRoute();
                  console.log('✅ REDIRECTING TO:', dashboardRoute);
                  this.router.navigateByUrl(dashboardRoute);
                } else {
                  this.toastr.error('Failed to load user details, please login again');
                  this.authService.logout(false);
                }
              },
              error: (err) => {
                this.loading = false;
                console.error('❌ User load failed:', err);
                this.toastr.error('Failed to load user details');
              },
            });
        },
        error: (error) => {
          this.loading = false;
          console.error('❌ Login error:', error);

          // Handle different error types
          let errorMessage = 'Login failed';

          if (error?.message) {
            errorMessage = error.message;
          } else if (error?.error?.message) {
            errorMessage = error.error.message;
          } else if (typeof error === 'string') {
            errorMessage = error;
          }

          this.toastr.error(errorMessage, 'Login Error');
        },
      });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
