import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OfficerGrievanceService } from '../services/officer-grievance';
import {
  Grievance,
  GrievanceStatus,
  StatusHistory,
  GrievanceComment,
  GrievanceDocument,
  UpdateGrievanceStatusRequest,
  UploadDocumentRequest,
} from '../../../core/models/index';
import { FileUploadResult } from '../../../shared/components/file-upload/index';

@Component({
  selector: 'app-resolve-grievance',
  standalone: false,
  templateUrl: './resolve-grievance.html',
  styleUrls: ['./resolve-grievance.scss'],
})
export class ResolveGrievanceComponent implements OnInit {
  grievanceId!: number;
  grievance?: Grievance;
  statusHistory: StatusHistory[] = [];
  comments: GrievanceComment[] = [];
  documents: GrievanceDocument[] = [];

  resolutionForm!: FormGroup;
  commentForm!: FormGroup;

  loading = true;
  submitting = false;
  addingComment = false;
  uploadedFiles: FileUploadResult[] = [];

  availableStatuses: { value: GrievanceStatus; label: string }[] = [];
  GrievanceStatus = GrievanceStatus;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private officerService: OfficerGrievanceService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.grievanceId = Number(this.route.snapshot.paramMap.get('id'));
    this.initForms();
    this.loadAllData();
  }

  initForms(): void {
    this.resolutionForm = this.fb.group({
      status: ['', [Validators.required]],
      remarks: ['', [Validators.minLength(10), Validators.maxLength(1000)]],
    });

    this.commentForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  loadAllData(): void {
    this.loading = true;

    this.officerService.getGrievanceById(this.grievanceId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.grievance = response.data;
          this.setAvailableStatuses();
          this.resolutionForm.patchValue({ status: this.grievance.status });
        }
      },
      error: () => {
        this.toastr.error('Failed to load grievance', 'Error');
      },
      complete: () => {
        this.loading = false;
      },
    });

    this.loadComments();
    this.loadDocuments();
  }

  setAvailableStatuses(): void {
    if (!this.grievance) return;

    const currentStatus = this.grievance.status;

    switch (currentStatus) {
      case GrievanceStatus.SUBMITTED:
      case GrievanceStatus.ASSIGNED:
        this.availableStatuses = [
          { value: GrievanceStatus.ASSIGNED, label: 'Assigned' },
          { value: GrievanceStatus.IN_REVIEW, label: 'In Review' },
        ];
        break;
      case GrievanceStatus.IN_REVIEW:
        this.availableStatuses = [
          { value: GrievanceStatus.IN_REVIEW, label: 'In Review' },
          { value: GrievanceStatus.RESOLVED, label: 'Resolved' },
        ];
        break;
      case GrievanceStatus.RESOLVED:
        this.availableStatuses = [{ value: GrievanceStatus.RESOLVED, label: 'Resolved' }];
        break;
      default:
        this.availableStatuses = [];
    }
  }

  loadComments(): void {
    this.officerService.getGrievanceComments(this.grievanceId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.comments = response.data;
        }
      },
    });
  }

  loadDocuments(): void {
    this.officerService.getGrievanceDocuments(this.grievanceId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.documents = response.data;
        }
      },
    });
  }

  onFilesSelected(files: FileUploadResult[]): void {
    this.uploadedFiles = files;
  }

  addComment(): void {
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      return;
    }

    this.addingComment = true;
    const request = {
      message: this.commentForm.value.message,
      isInternal: false,
    };

    this.officerService.addComment(this.grievanceId, request).subscribe({
      next: () => {
        this.addingComment = false;
        this.toastr.success('Comment added', 'Success');
        this.commentForm.reset();
        this.loadComments();
      },
      error: (error) => {
        this.addingComment = false;
        this.toastr.error('Failed to add comment', 'Error');
      },
    });
  }

  onSubmit(): void {
    if (this.resolutionForm.invalid) {
      this.resolutionForm.markAllAsTouched();
      this.toastr.warning('Please fill all required fields', 'Validation Error');
      return;
    }

    this.submitting = true;

    const request: UpdateGrievanceStatusRequest = {
      status: this.resolutionForm.value.status,
      remarks: this.resolutionForm.value.remarks || undefined,
    };

    this.officerService.updateGrievanceStatus(this.grievanceId, request).subscribe({
      next: (response) => {
        if (this.uploadedFiles.length > 0) {
          this.uploadDocuments();
        } else {
          this.handleSuccess();
        }
      },
      error: (error) => {
        this.submitting = false;
        this.toastr.error(error.message || 'Failed to update status', 'Error');
      },
    });
  }

  uploadDocuments(): void {
    let uploadedCount = 0;
    const totalFiles = this.uploadedFiles.length;

    this.uploadedFiles.forEach((file) => {
      const uploadRequest: UploadDocumentRequest = {
        fileName: file.fileName,
        fileType: file.fileType,
        fileDataBase64: file.fileDataBase64,
      };

      this.officerService.uploadDocument(this.grievanceId, uploadRequest).subscribe({
        next: () => {
          uploadedCount++;
          if (uploadedCount === totalFiles) {
            this.handleSuccess();
          }
        },
        error: (error) => {
          console.error('Failed to upload file:', file.fileName);
          uploadedCount++;
          if (uploadedCount === totalFiles) {
            this.handleSuccess();
          }
        },
      });
    });
  }

  handleSuccess(): void {
    this.submitting = false;
    this.toastr.success('Grievance updated successfully', 'Success');
    this.router.navigate(['/officer/grievances']);
  }

  onCancel(): void {
    this.router.navigate(['/officer/grievances']);
  }

  downloadDocument(doc: GrievanceDocument): void {
    const linkSource = `data:${doc.fileType};base64,${doc.fileData}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = linkSource;
    downloadLink.download = doc.fileName;
    downloadLink.click();
  }

  canUpdateStatus(): boolean {
    return (
      this.grievance?.status !== GrievanceStatus.CLOSED &&
      this.grievance?.status !== GrievanceStatus.ESCALATED
    );
  }

  get f() {
    return this.resolutionForm.controls;
  }
}
