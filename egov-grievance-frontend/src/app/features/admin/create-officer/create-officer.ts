// src/app/features/admin/create-officer/create-officer.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserManagementService } from '../services/user-management';
import { DepartmentService, Department } from '../services/department';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-create-officer',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Create Officer</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Full Name</mat-label>
            <input matInput formControlName="fullName" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Phone</mat-label>
            <input matInput formControlName="phone" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Department</mat-label>
            <mat-select formControlName="departmentId">
              <mat-option *ngFor="let d of departments" [value]="d.id">{{ d.name }}</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit">Create Officer</button>
          <button mat-button type="button" (click)="router.navigate(['/admin/users'])">
            Cancel
          </button>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: ['.full-width { width: 100%; margin-bottom: 16px; }'],
  standalone: false,
})
export class CreateOfficerComponent implements OnInit {
  form!: FormGroup;
  departments: Department[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserManagementService,
    private deptService: DepartmentService,
    public router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      role: ['DEPT_OFFICER'],
      departmentId: ['', [Validators.required]],
    });
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.deptService.getAllDepartments().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.departments = res.data;
        }
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.userService.createOfficer(this.form.value).subscribe({
      next: () => {
        this.toastr.success('Officer created successfully');
        this.router.navigate(['/admin/users']);
      },
      error: (err) => this.toastr.error(err.message || 'Failed to create officer'),
    });
  }
}
