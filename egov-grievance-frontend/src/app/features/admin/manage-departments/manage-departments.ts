// src/app/features/admin/manage-departments/manage-departments.component.ts
import { Component, OnInit } from '@angular/core';
import { DepartmentService, Department } from '../services/department';
import { ToastrService } from 'ngx-toastr';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-manage-departments',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Manage Departments</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Departments: {{ departments.length }}</p>
        <mat-list>
          <mat-list-item *ngFor="let dept of departments">
            <span matListItemTitle>{{ dept.name }}</span>
            <span matListItemLine>{{ dept.description }}</span>
          </mat-list-item>
        </mat-list>
      </mat-card-content>
    </mat-card>
  `,
  standalone: false,
})
export class ManageDepartmentsComponent implements OnInit {
  departments: Department[] = [];

  constructor(private departmentService: DepartmentService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.departments = res.data;
          console.log('✅ Departments loaded:', this.departments.length);
        }
      },
      error: (err) => {
        console.error('❌ Error loading departments:', err);
        this.toastr.error('Failed to load departments');
      },
    });
  }
}
