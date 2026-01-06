// src/app/features/supervisor/assign-grievance/assign-grievance.ts
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
  grievance: Grievance | null = null; // ✅ Changed from ? to null
  officers: User[] = [];
  loading = false;
  loadingOfficers = false;

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
  }

  /**
   * Load grievance details and then load officers
   */
  loadGrievance(): void {
    this.loading = true;
    console.log(`📥 Loading grievance: ${this.grievanceId}`);

    this.supervisorService.getGrievanceById(this.grievanceId).subscribe({
      next: (res) => {
        console.log('✅ Grievance loaded:', res.data);
        if (res.success && res.data) {
          this.grievance = res.data;
          // Load officers after grievance is loaded
          this.loadOfficers();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Failed to load grievance:', err);
        this.toastr.error('Failed to load grievance');
        this.loading = false;
      },
    });
  }

  /**
   * Load officers for the grievance's department
   */
  loadOfficers(): void {
    if (!this.grievance?.departmentId) {
      console.warn('⚠️ No department ID available');
      this.toastr.error('No department assigned to this grievance');
      return;
    }

    this.loadingOfficers = true;
    console.log(`📥 Loading officers for department: ${this.grievance.departmentId}`);

    this.supervisorService.getDepartmentOfficers(this.grievance.departmentId).subscribe({
      next: (res) => {
        console.log('✅ Officers loaded:', res.data);
        if (res.success && res.data) {
          this.officers = res.data;
          console.log(`Found ${this.officers.length} officers`);
        }
        this.loadingOfficers = false;
      },
      error: (err) => {
        console.error('❌ Failed to load officers:', err);
        this.toastr.error('Failed to load officers');
        this.loadingOfficers = false;
      },
    });
  }

  /**
   * Assign grievance to selected officer
   */
  onSubmit(): void {
    if (this.assignForm.invalid) {
      this.toastr.error('Please select an officer');
      return;
    }

    const officerId = this.assignForm.value.officerId;
    console.log(`📤 Assigning grievance ${this.grievanceId} to officer ${officerId}`);

    this.loading = true;

    this.supervisorService.assignGrievance(this.grievanceId, officerId).subscribe({
      next: (res) => {
        console.log('✅ Grievance assigned successfully:', res);
        this.loading = false;
        this.toastr.success('Grievance assigned successfully', 'Success');
        this.router.navigate(['/supervisor/escalations']);
      },
      error: (err) => {
        console.error('❌ Assignment failed:', err);
        this.loading = false;
        this.toastr.error(err?.message || 'Failed to assign grievance', 'Assignment Error');
      },
    });
  }

  /**
   * Cancel and go back
   */
  onCancel(): void {
    this.router.navigate(['/supervisor/escalations']);
  }

  /**
   * Get officer name by ID for display
   */
  getOfficerName(officerId: number): string {
    const officer = this.officers.find((o) => o.id === officerId);
    return officer?.fullName || 'Unknown';
  }
}
