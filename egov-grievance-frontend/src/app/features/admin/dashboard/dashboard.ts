// src/app/features/admin/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserManagementService } from '../services/user-management';
import { DepartmentService } from '../services/department';
import { User } from '../../../core/models';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  standalone: false,
})
export class DashboardComponent implements OnInit {
  loading = true;
  totalUsers = 0;
  totalDepartments = 0;
  totalGrievances = 0;
  activeOfficers = 0;

  constructor(
    private userService: UserManagementService,
    private departmentService: DepartmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('🎯 [ADMIN DASHBOARD] Initialized');
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;

    // Load users
    this.userService.getAllUsers(0, 1000).subscribe({
      next: (response) => {
        console.log('✅ [ADMIN] Users loaded:', response.data?.totalElements);
        if (response.success && response.data) {
          this.totalUsers = response.data.totalElements || 0;
          this.activeOfficers = (response.data.content || []).filter(
            (u: User) => (u.role === 'DEPT_OFFICER' || u.role === 'SUPERVISOR') && u.isActive
          ).length;
        }
      },
      error: (err) => console.error('❌ Failed to load users:', err),
    });

    // Load departments
    this.departmentService.getAllDepartments().subscribe({
      next: (response) => {
        console.log('✅ [ADMIN] Departments loaded:', response.data?.length);
        if (response.success && response.data) {
          this.totalDepartments = response.data.length || 0;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Failed to load departments:', err);
        this.loading = false;
      },
    });
  }

  navigateTo(route: string): void {
    console.log(`🔗 [ADMIN] Navigating to: ${route}`);
    this.router.navigate([`/admin/${route}`]);
  }
}
