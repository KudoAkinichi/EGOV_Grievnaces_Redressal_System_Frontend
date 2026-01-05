// src/app/features/supervisor/assign-grievance/assign-grievance.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SupervisorService } from '../services/supervisor';
import { Grievance, User } from '../../../core/models/index';

@Component({
  selector: 'app-assign-grievance',
  standalone: false,
  templateUrl: './assign-grievance.html',
  styleUrls: ['./assign-grievance.scss'],
})
export class AssignGrievanceComponent implements OnInit {
  assignForm!: FormGroup;
  grievanceId!: number;
  grievance?: Grievance;
  officers: User[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private supervisorService: SupervisorService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.grievanceId = +this.route.snapshot.params['id'];

    this.assignForm = this.fb.group({
      officerId: ['', Validators.required],
    });

    this.loadGrievance();
    this.loadOfficers();
  }

  loadGrievance(): void {
    this.supervisorService.getGrievanceById(this.grievanceId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.grievance = res.data;
        }
      },
      error: () => {
        this.toastr.error('Failed to load grievance');
      },
    });
  }

  loadOfficers(): void {
    if (!this.grievance?.departmentId) {
      // fallback: fetch grievance first
      this.supervisorService.getGrievanceById(this.grievanceId).subscribe({
        next: (res) => {
          if (res.success && res.data?.departmentId) {
            this.fetchOfficers(res.data.departmentId);
          }
        },
      });
      return;
    }

    this.fetchOfficers(this.grievance.departmentId);
  }

  fetchOfficers(departmentId: number): void {
    this.supervisorService.getDepartmentOfficers(departmentId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.officers = res.data;
        }
      },
      error: () => {
        this.toastr.error('Failed to load officers');
      },
    });
  }

  onSubmit(): void {
    if (this.assignForm.invalid) return;

    this.loading = true;

    this.supervisorService
      .assignGrievance(this.grievanceId, this.assignForm.value.officerId)
      .subscribe({
        next: () => {
          this.loading = false;
          this.toastr.success('Grievance assigned successfully');
          this.router.navigate(['/supervisor/grievances']);
        },
        error: (err) => {
          this.loading = false;
          this.toastr.error(err?.message || 'Assignment failed');
        },
      });
  }

  onCancel(): void {
    this.router.navigate(['/supervisor/grievances']);
  }
}
