// src/app/features/supervisor/escalations/escalations.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SupervisorService } from '../services/supervisor';
import { Grievance } from '../../../core/models/grievance.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-escalations',
  templateUrl: './escalations.html',
  styleUrls: ['./escalations.scss'],
  standalone: false,
})
export class EscalationsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  totalElements = 0;
  displayedColumns = ['grievanceNumber', 'title', 'status', 'actions'];
  dataSource = new MatTableDataSource<Grievance>([]);
  selectedFilter: 'all' | 'escalated' | 'assigned' | 'in-review' = 'escalated';
  loading = true;
  pageSize = 10;

  constructor(
    private supervisorService: SupervisorService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadGrievances();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadGrievances(): void {
    this.loading = true;
    const pageIndex = this.paginator?.pageIndex ?? 0;
    const pageSize = this.paginator?.pageSize ?? 10;

    console.log(
      `📥 Loading ${this.selectedFilter} grievances - Page: ${pageIndex}, Size: ${pageSize}`
    );

    let request$;

    switch (this.selectedFilter) {
      case 'escalated':
        request$ = this.supervisorService.getEscalatedGrievances(pageIndex, pageSize);
        break;
      case 'assigned':
        request$ = this.supervisorService.getAssignedGrievances(pageIndex, pageSize);
        break;
      case 'in-review':
        request$ = this.supervisorService.getInReviewGrievances(pageIndex, pageSize);
        break;
      case 'all':
      default:
        request$ = this.supervisorService.getAllDepartmentGrievances(pageIndex, pageSize);
        break;
    }

    request$.subscribe({
      next: (res) => {
        console.log('✅ Grievances loaded:', res.data);
        if (res.success && res.data) {
          this.dataSource.data = res.data.content || [];
          this.totalElements = res.data.totalElements || 0;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Failed to load grievances:', err);
        this.toastr.error('Failed to load grievances', 'Error');
        this.loading = false;
      },
    });
  }

  onFilterChange(): void {
    console.log('🔄 Filter changed to:', this.selectedFilter);
    // Reset to first page when filter changes
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadGrievances();
  }

  onPageChange(event: PageEvent): void {
    console.log('📄 Page changed:', event);
    this.loadGrievances();
  }

  assignGrievance(grievanceId: number): void {
    this.router.navigate(['/supervisor/assign', grievanceId]);
  }

  viewDetails(grievanceId: number): void {
    this.router.navigate(['/supervisor/grievances', grievanceId]);
  }
}
