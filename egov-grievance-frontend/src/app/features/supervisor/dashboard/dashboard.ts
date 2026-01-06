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
  totalGrievances = 0;
  escalatedCount = 0;
  resolvedCount = 0;
  assignedCount = 0;

  constructor(
    private dashboardService: SupervisorDashboardService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();

    if (!user) {
      console.error('❌ No user found');
      this.loading = false;
      this.toastr.error('User not authenticated', 'Error');
      return;
    }

    const departmentId = user.departmentId || 1;
    console.log(`📊 Loading stats for department: ${departmentId}`);
    this.loadStats(departmentId);
  }

  loadStats(departmentId: number): void {
    this.loading = true;

    this.dashboardService.getDashboardStats(departmentId).subscribe({
      next: (res) => {
        console.log('✅ Dashboard stats loaded:', res.data);
        if (res.success && res.data) {
          this.totalGrievances = res.data.total ?? 0;
          this.escalatedCount = res.data.escalated ?? 0;
          this.resolvedCount = res.data.resolved ?? 0;
          this.assignedCount = res.data.assigned ?? 0;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Dashboard load failed:', err);
        this.toastr.error('Failed to load dashboard', 'Error');
        this.loading = false;
      },
    });
  }

  navigateToAll(): void {
    this.router.navigate(['/supervisor/escalations'], { queryParams: { filter: 'all' } });
  }

  navigateToEscalated(): void {
    this.router.navigate(['/supervisor/escalations'], { queryParams: { filter: 'escalated' } });
  }

  navigateToAssigned(): void {
    this.router.navigate(['/supervisor/escalations'], { queryParams: { filter: 'assigned' } });
  }

  navigateToReview(): void {
    this.router.navigate(['/supervisor/escalations'], { queryParams: { filter: 'in-review' } });
  }
}
