import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GrievanceService } from '../../../core/services/grievance.service';
import { FeedbackService } from '../../../core/services/feedback.service';
import {
  Grievance,
  StatusHistory,
  GrievanceComment,
  GrievanceDocument,
  GrievanceStatus,
} from '../../../core/models/index';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-grievance-details',
  standalone: false,
  templateUrl: './grievance-details.html',
  styleUrls: ['./grievance-details.scss'],
})
export class GrievanceDetailsComponent implements OnInit {
  grievanceId!: number;
  grievance?: Grievance;
  statusHistory: StatusHistory[] = [];
  comments: GrievanceComment[] = [];
  documents: GrievanceDocument[] = [];

  commentForm!: FormGroup;
  loading = true;
  addingComment = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private grievanceService: GrievanceService,
    private feedbackService: FeedbackService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.grievanceId = +this.route.snapshot.params['id'];
    this.initCommentForm();
    this.loadAllData();
  }

  initCommentForm(): void {
    this.commentForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  loadAllData(): void {
    this.loading = true;

    // Load grievance details
    this.grievanceService.getGrievanceById(this.grievanceId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.grievance = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error('Failed to load grievance details', 'Error');
        this.loading = false;
      },
    });

    // Load status history
    this.grievanceService.getStatusHistory(this.grievanceId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.statusHistory = response.data;
        }
      },
    });

    // Load comments
    this.loadComments();

    // Load documents
    this.loadDocuments();
  }

  loadComments(): void {
    this.grievanceService.getGrievanceComments(this.grievanceId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.comments = response.data;
        }
      },
    });
  }

  loadDocuments(): void {
    this.grievanceService.getGrievanceDocuments(this.grievanceId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.documents = response.data;
        }
      },
    });
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

    this.grievanceService.addComment(this.grievanceId, request).subscribe({
      next: (response) => {
        this.addingComment = false;
        this.toastr.success('Comment added successfully', 'Success');
        this.commentForm.reset();
        this.loadComments();
      },
      error: (error) => {
        this.addingComment = false;
        this.toastr.error('Failed to add comment', 'Error');
      },
    });
  }

  canEscalate(): boolean {
    return this.grievance?.status === GrievanceStatus.RESOLVED;
  }

  canWithdraw(): boolean {
    return (
      this.grievance?.status === GrievanceStatus.SUBMITTED ||
      this.grievance?.status === GrievanceStatus.ASSIGNED
    );
  }

  canProvideFeedback(): boolean {
    return this.grievance?.status === GrievanceStatus.RESOLVED;
  }

  canClose(): boolean {
    return this.grievance?.status === GrievanceStatus.RESOLVED;
  }

  escalate(): void {
    const dialogData: ConfirmDialogData = {
      title: 'Escalate Grievance',
      message:
        'Are you sure you want to escalate this grievance? It will be assigned to a supervisor for review.',
      confirmText: 'Escalate',
      cancelText: 'Cancel',
      type: 'warning',
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.grievanceService.escalateGrievance(this.grievanceId).subscribe({
          next: (response) => {
            this.toastr.success('Grievance escalated successfully', 'Success');
            this.loadAllData();
          },
          error: (error) => {
            this.toastr.error(error.message, 'Error');
          },
        });
      }
    });
  }

  withdraw(): void {
    const dialogData: ConfirmDialogData = {
      title: 'Withdraw Grievance',
      message: 'Are you sure you want to withdraw this grievance? This action cannot be undone.',
      confirmText: 'Withdraw',
      cancelText: 'Cancel',
      type: 'danger',
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.grievanceService.withdrawGrievance(this.grievanceId).subscribe({
          next: (response) => {
            this.toastr.success('Grievance withdrawn successfully', 'Success');
            this.router.navigate(['/citizen/my-grievances']);
          },
          error: (error) => {
            this.toastr.error(error.message, 'Error');
          },
        });
      }
    });
  }

  closeGrievance(): void {
    const request = {
      status: GrievanceStatus.CLOSED,
      remarks: 'Closed by citizen',
    };

    this.grievanceService.updateGrievanceStatus(this.grievanceId, request).subscribe({
      next: (response) => {
        this.toastr.success('Grievance closed successfully', 'Success');
        this.loadAllData();
      },
      error: (error) => {
        this.toastr.error(error.message, 'Error');
      },
    });
  }

  navigateToFeedback(): void {
    this.router.navigate(['/citizen/feedback', this.grievanceId]);
  }

  downloadDocument(doc: GrievanceDocument): void {
    const linkSource = `data:${doc.fileType};base64,${doc.fileDataBase64}`;
    const link = document.createElement('a');
    link.href = linkSource;
    link.download = doc.fileName;
    link.click();
  }

  viewDocument(doc: GrievanceDocument): void {
    const url = this.grievanceService.getDocumentPreviewUrl(doc);
    window.open(url, '_blank');
  }

  isImageFile(doc: GrievanceDocument): boolean {
    return this.grievanceService.isImageFile(doc.fileType);
  }

  isPdfFile(doc: GrievanceDocument): boolean {
    return this.grievanceService.isPdfFile(doc.fileType);
  }
}
