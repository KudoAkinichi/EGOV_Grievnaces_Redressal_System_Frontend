import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SupervisorDashboardService } from '../services/supervisor-dashboard';

@Component({
  selector: 'app-supervisor-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  standalone: false,
})
export class DashboardComponent implements OnInit {
  loading = true; // ✅ ADD THIS

  totalGrievances = 0;
  escalatedCount = 0;
  resolvedCount = 0;

  constructor(
    private dashboardService: SupervisorDashboardService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();

    if (!user || !user.departmentId) {
      console.error('Supervisor department missing');
      this.loading = false;
      return;
    }

    this.loadStats(user.departmentId);
  }

  loadStats(departmentId: number): void {
    this.loading = true; // ✅ start loader

    this.dashboardService.getDashboardStats(departmentId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.totalGrievances = res.data.total ?? 0;
          this.escalatedCount = res.data.escalated ?? 0;
          this.resolvedCount = res.data.resolved ?? 0;
        }
        this.loading = false; // ✅ stop loader
      },
      error: (err) => {
        console.error('Dashboard load failed', err);
        this.loading = false; // ✅ stop loader even on error
      },
    });
  }
}
