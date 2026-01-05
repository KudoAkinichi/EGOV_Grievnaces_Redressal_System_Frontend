import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FeedbackService } from '../../../core/services/feedback.service';
import { GrievanceService } from '../../../core/services/grievance.service';
import { AuthService } from '../../../core/services/auth.service';
import { Grievance, CreateFeedbackRequest } from '../../../core/models/index';

@Component({
  selector: 'app-feedback-form',
  standalone: false,
  templateUrl: './feedback-form.html',
  styleUrls: ['./feedback-form.scss'],
})
export class FeedbackFormComponent implements OnInit {
  feedbackForm!: FormGroup;
  grievanceId!: number;
  grievance?: Grievance;
  rating = 0;
  loading = false;
  loadingGrievance = true;
  feedbackExists = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private feedbackService: FeedbackService,
    private grievanceService: GrievanceService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.grievanceId = +this.route.snapshot.params['grievanceId'];
    this.initForm();
    this.loadGrievance();
    this.checkExistingFeedback();
  }

  initForm(): void {
    this.feedbackForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comments: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    });
  }

  loadGrievance(): void {
    this.loadingGrievance = true;
    this.grievanceService.getGrievanceById(this.grievanceId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.grievance = response.data;

          // Check if grievance is resolved
          if (this.grievance.status !== 'RESOLVED') {
            this.toastr.warning(
              'Feedback can only be submitted for resolved grievances',
              'Warning'
            );
            this.router.navigate(['/citizen/grievance', this.grievanceId]);
          }
        }
        this.loadingGrievance = false;
      },
      error: (error) => {
        this.toastr.error('Failed to load grievance', 'Error');
        this.loadingGrievance = false;
      },
    });
  }

  checkExistingFeedback(): void {
    this.feedbackService.checkFeedbackExists(this.grievanceId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.feedbackExists = true;
          this.toastr.info('You have already submitted feedback for this grievance', 'Info');
          this.router.navigate(['/citizen/grievance', this.grievanceId]);
        }
      },
    });
  }

  get f() {
    return this.feedbackForm.controls;
  }

  setRating(star: number): void {
    this.rating = star;
    this.feedbackForm.patchValue({ rating: star });
  }

  getStarArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

  onSubmit(): void {
    if (this.feedbackForm.invalid) {
      this.feedbackForm.markAllAsTouched();
      this.toastr.warning('Please provide rating and comments', 'Validation Error');
      return;
    }

    this.loading = true;
    const request: CreateFeedbackRequest = {
      grievanceId: this.grievanceId,
      citizenId: this.authService.getCurrentUserId()!,
      rating: this.feedbackForm.value.rating,
      comments: this.feedbackForm.value.comments,
    };

    this.feedbackService.submitFeedback(request).subscribe({
      next: (response) => {
        this.loading = false;
        this.toastr.success('Thank you for your feedback!', 'Success');
        this.router.navigate(['/citizen/grievance', this.grievanceId]);
      },
      error: (error) => {
        this.loading = false;
        this.toastr.error(error.message || 'Failed to submit feedback', 'Error');
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/citizen/grievance', this.grievanceId]);
  }
}
