import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GrievanceService } from '../../../core/services/grievance.service';
import {
  Department,
  Category,
  CreateGrievanceRequest,
  UploadDocumentRequest,
} from '../../../core/models/index';
import { FileUploadResult } from '../../../shared/components/file-upload/file-upload';

@Component({
  selector: 'app-lodge-grievance',
  standalone: false,
  templateUrl: './lodge-grievance.html',
  styleUrls: ['./lodge-grievance.scss'],
})
export class LodgeGrievanceComponent implements OnInit {
  grievanceForm!: FormGroup;
  departments: Department[] = [];
  categories: Category[] = [];
  loading = false;
  loadingDepartments = true;
  uploadedFiles: FileUploadResult[] = [];

  constructor(
    private fb: FormBuilder,
    private grievanceService: GrievanceService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDepartments();
  }

  initForm(): void {
    this.grievanceForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      description: [
        '',
        [Validators.required, Validators.minLength(20), Validators.maxLength(2000)],
      ],
      departmentId: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
    });
  }

  get f() {
    return this.grievanceForm.controls;
  }

  loadDepartments(): void {
    this.loadingDepartments = true;
    this.grievanceService.getAllDepartments().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.departments = response.data.filter((dept) => dept.isActive);
        }
        this.loadingDepartments = false;
      },
      error: (error) => {
        this.toastr.error('Failed to load departments', 'Error');
        this.loadingDepartments = false;
      },
    });
  }

  onDepartmentChange(departmentId: number): void {
    // Reset category selection
    this.grievanceForm.patchValue({ categoryId: '' });
    this.categories = [];

    if (!departmentId) return;

    // Load categories for selected department
    this.grievanceService.getDepartmentCategories(departmentId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.categories = response.data.filter((cat) => cat.isActive);
        }
      },
      error: (error) => {
        this.toastr.error('Failed to load categories', 'Error');
      },
    });
  }

  onFilesSelected(files: FileUploadResult[]): void {
    this.uploadedFiles = files;
  }

  onSubmit(): void {
    if (this.grievanceForm.invalid) {
      this.grievanceForm.markAllAsTouched();
      this.toastr.warning('Please fill all required fields', 'Validation Error');
      return;
    }

    this.loading = true;

    const request: CreateGrievanceRequest = {
      title: this.grievanceForm.value.title.trim(),
      description: this.grievanceForm.value.description.trim(),
      departmentId: this.grievanceForm.value.departmentId,
      categoryId: this.grievanceForm.value.categoryId,
    };

    // Step 1: Create grievance
    this.grievanceService.createGrievance(request).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const grievanceId = response.data.id;

          // Step 2: Upload documents if any
          if (this.uploadedFiles.length > 0) {
            this.uploadDocuments(grievanceId);
          } else {
            this.handleSuccess(response.data.grievanceNumber);
          }
        } else {
          this.loading = false;
          this.toastr.error(response.message, 'Error');
        }
      },
      error: (error) => {
        this.loading = false;
        this.toastr.error(error.message || 'Failed to lodge grievance', 'Error');
      },
    });
  }

  uploadDocuments(grievanceId: number): void {
    let uploadedCount = 0;
    const totalFiles = this.uploadedFiles.length;

    this.uploadedFiles.forEach((file, index) => {
      const uploadRequest: UploadDocumentRequest = {
        fileName: file.fileName,
        fileType: file.fileType,
        fileDataBase64: file.fileDataBase64,
      };

      this.grievanceService.uploadDocument(grievanceId, uploadRequest).subscribe({
        next: () => {
          uploadedCount++;
          if (uploadedCount === totalFiles) {
            // All files uploaded
            this.handleSuccess(`GRV-${grievanceId}`);
          }
        },
        error: (error) => {
          console.error('Failed to upload file:', file.fileName, error);
          uploadedCount++;
          if (uploadedCount === totalFiles) {
            // Continue even if some uploads failed
            this.handleSuccess(`GRV-${grievanceId}`);
          }
        },
      });
    });
  }

  handleSuccess(grievanceNumber: string): void {
    this.loading = false;
    this.toastr.success(
      `Grievance ${grievanceNumber} lodged successfully! You will receive email notifications for updates.`,
      'Success',
      { timeOut: 5000 }
    );
    this.router.navigate(['/citizen/my-grievances']);
  }

  onCancel(): void {
    this.router.navigate(['/citizen/dashboard']);
  }

  getCharacterCount(controlName: string): string {
    const control = this.grievanceForm.get(controlName);
    if (!control) return '0';
    return (control.value || '').length.toString();
  }
}
