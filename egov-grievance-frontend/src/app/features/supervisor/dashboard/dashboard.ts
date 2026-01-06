// src/app/features/supervisor/dashboard/dashboard.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SupervisorDashboardService } from '../services/supervisor-dashboard';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-supervisor-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  standalone: false,
})
export class DashboardComponent implements OnInit {
  loading = true;

  // ✅ All stats with defaults shown
  totalGrievances = 0;
  escalatedCount = 0;
  resolvedCount = 0;
  assignedCount = 0;
  inReviewCount = 0;
  openIssuesCount = 0;

  constructor(
    private dashboardService: SupervisorDashboardService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    console.log('🎯 Dashboard Component Initialized');
    const user = this.authService.getCurrentUser();

    if (!user) {
      console.error('❌ No user found');
      this.loading = false;
      this.toastr.error('User not authenticated', 'Error');
      return;
    }

    const departmentId = user.departmentId || 1;
    console.log(`📊 [DASHBOARD] Loading stats for department: ${departmentId}`);
    console.log(`📊 [DASHBOARD] User role: ${user.role}`);
    this.loadStats(departmentId);
  }

  loadStats(departmentId: number): void {
    this.loading = true;
    console.log(`⏳ [DASHBOARD] Starting stats load...`);

    this.dashboardService.getDashboardStats(departmentId).subscribe({
      next: (res) => {
        console.log('✅ [DASHBOARD] Stats response received:', res);

        if (res.success && res.data) {
          // ✅ Set all values with fallback to 0
          this.totalGrievances = res.data.total ?? 0;
          this.escalatedCount = res.data.escalated ?? 0;
          this.resolvedCount = res.data.resolved ?? 0;
          this.assignedCount = res.data.assigned ?? 0;
          this.inReviewCount = res.data.inReview ?? 0;
          this.openIssuesCount = res.data.openIssues ?? 0;

          console.log('✅ [DASHBOARD] All stats loaded:', {
            total: this.totalGrievances,
            escalated: this.escalatedCount,
            resolved: this.resolvedCount,
            assigned: this.assignedCount,
            inReview: this.inReviewCount,
            openIssues: this.openIssuesCount,
          });
        } else {
          console.warn('⚠️ [DASHBOARD] No data in response, using defaults (0)');
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('❌ [DASHBOARD] Load failed:', err);
        console.error('❌ [DASHBOARD] Using default values: 0');

        // Keep defaults (0) when error occurs
        this.totalGrievances = 0;
        this.escalatedCount = 0;
        this.resolvedCount = 0;
        this.assignedCount = 0;
        this.inReviewCount = 0;
        this.openIssuesCount = 0;

        this.toastr.error('Failed to load dashboard stats', 'Error');
        this.loading = false;
      },
    });
  }

  navigateToAll(): void {
    console.log('🔗 [DASHBOARD] Navigating to All Grievances');
    this.router.navigate(['/supervisor/escalations'], { queryParams: { filter: 'all' } });
  }

  navigateToEscalated(): void {
    console.log('🔗 [DASHBOARD] Navigating to Escalated Grievances');
    this.router.navigate(['/supervisor/escalations'], { queryParams: { filter: 'escalated' } });
  }

  navigateToAssigned(): void {
    console.log('🔗 [DASHBOARD] Navigating to Assigned Grievances');
    this.router.navigate(['/supervisor/escalations'], { queryParams: { filter: 'assigned' } });
  }

  navigateToReview(): void {
    console.log('🔗 [DASHBOARD] Navigating to In-Review Grievances');
    this.router.navigate(['/supervisor/escalations'], { queryParams: { filter: 'in-review' } });
  }
}
