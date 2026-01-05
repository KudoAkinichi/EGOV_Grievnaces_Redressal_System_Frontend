import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { OfficerGrievanceService } from '../services/officer-grievance';
import { AuthService } from '../../../core/services/auth.service';
import { OfficerDashboardStats } from '../../../core/models/index';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-officer-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: OfficerDashboardStats | null = null;
  loading = true;
  userName = '';
  officerId!: number;
  private refreshSubscription?: Subscription;

  constructor(
    private officerService: OfficerGrievanceService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.userName = user?.fullName || 'Officer';
    this.officerId = this.authService.getCurrentUserId()!;

    this.loadDashboard();
    this.setupAutoRefresh();
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadDashboard(): void {
    this.loading = true;
    this.officerService.getOfficerDashboard(this.officerId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.stats = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard:', error);
        this.loading = false;
      },
    });
  }

  setupAutoRefresh(): void {
    this.refreshSubscription = interval(environment.dashboard.refreshInterval)
      .pipe(switchMap(() => this.officerService.getOfficerDashboard(this.officerId)))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.stats = response.data;
          }
        },
      });
  }

  navigateToGrievances(): void {
    this.router.navigate(['/officer/grievances']);
  }

  navigateToAssignedGrievances(): void {
    this.router.navigate(['/officer/grievances'], { queryParams: { filter: 'assigned' } });
  }
}
