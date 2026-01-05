import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { GrievanceService } from '../../../core/services/grievance.service';
import { AuthService } from '../../../core/services/auth.service';
import { CitizenDashboardStats, Grievance } from '../../../core/models/index';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: CitizenDashboardStats | null = null;
  recentGrievances: Grievance[] = [];
  loading = true;
  userName = '';

  private refreshSubscription?: Subscription;

  constructor(
    private grievanceService: GrievanceService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.userName = user?.fullName || 'Citizen';

    this.loadDashboardData();
    this.setupAutoRefresh();
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadDashboardData(): void {
    this.loading = true;

    // Load statistics
    this.grievanceService.getCitizenDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.loading = false;
      },
    });

    // Load recent grievances (last 5)
    this.grievanceService.getMyGrievances(0, 5).subscribe({
      next: (response) => {
        if (response.success && response.data.content) {
          this.recentGrievances = response.data.content;
        }
      },
      error: (error) => {
        console.error('Error loading recent grievances:', error);
      },
    });
  }

  setupAutoRefresh(): void {
    // Auto-refresh dashboard every 30 seconds
    this.refreshSubscription = interval(environment.dashboard.refreshInterval)
      .pipe(switchMap(() => this.grievanceService.getCitizenDashboardStats()))
      .subscribe({
        next: (stats) => {
          this.stats = stats;
        },
        error: (error) => {
          console.error('Auto-refresh error:', error);
        },
      });
  }

  navigateToLodgeGrievance(): void {
    this.router.navigate(['/citizen/lodge-grievance']);
  }

  navigateToMyGrievances(): void {
    this.router.navigate(['/citizen/my-grievances']);
  }

  navigateToGrievanceDetails(grievanceId: number): void {
    this.router.navigate(['/citizen/grievance', grievanceId]);
  }

  getOpenGrievancesCount(): number {
    if (!this.stats) return 0;
    return this.stats.submitted + this.stats.assigned + this.stats.inReview;
  }
}
