// src/app/features/supervisor/escalations/escalations.ts
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
export class EscalationsComponent implements OnInit, AfterViewInit {
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
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    console.log('🎯 [ESCALATIONS] Component Initialized');

    // Check for filter from route params
    this.route.queryParams.subscribe((params) => {
      const filter = params['filter'];
      if (filter && ['all', 'escalated', 'assigned', 'in-review'].includes(filter)) {
        this.selectedFilter = filter as any;
        console.log(`📋 [ESCALATIONS] Filter from route: ${filter}`);
      }
    });

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
      `📥 [ESCALATIONS] Loading ${this.selectedFilter} grievances - Page: ${pageIndex}, Size: ${pageSize}`
    );

    let request$;

    switch (this.selectedFilter) {
      case 'escalated':
        console.log('📥 [ESCALATIONS] Fetching ESCALATED grievances');
        request$ = this.supervisorService.getEscalatedGrievances(pageIndex, pageSize);
        break;
      case 'assigned':
        console.log('📥 [ESCALATIONS] Fetching ASSIGNED grievances');
        request$ = this.supervisorService.getAssignedGrievances(pageIndex, pageSize);
        break;
      case 'in-review':
        console.log('📥 [ESCALATIONS] Fetching IN-REVIEW grievances');
        request$ = this.supervisorService.getInReviewGrievances(pageIndex, pageSize);
        break;
      case 'all':
      default:
        console.log('📥 [ESCALATIONS] Fetching ALL grievances');
        request$ = this.supervisorService.getAllDepartmentGrievances(pageIndex, pageSize);
        break;
    }

    request$.subscribe({
      next: (res) => {
        console.log('✅ [ESCALATIONS] API Response:', res);

        if (res.success && res.data) {
          const grievances = res.data.content || [];
          console.log(
            `✅ [ESCALATIONS] Loaded ${grievances.length} grievances (${this.selectedFilter})`
          );
          console.log(`📊 [ESCALATIONS] Total Elements: ${res.data.totalElements}`);
          console.log(`📊 [ESCALATIONS] Total Pages: ${res.data.totalPages}`);

          this.dataSource.data = grievances;
          this.totalElements = res.data.totalElements || 0;

          // Log each grievance status
          grievances.forEach((g: Grievance, idx: number) => {
            console.log(`  📄 Grievance ${idx + 1}: #${g.grievanceNumber} - Status: ${g.status}`);
          });
        } else {
          console.warn('⚠️ [ESCALATIONS] No data in response');
          this.dataSource.data = [];
          this.totalElements = 0;
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('❌ [ESCALATIONS] Failed to load grievances:', err);
        this.dataSource.data = [];
        this.totalElements = 0;
        this.toastr.error(`Failed to load ${this.selectedFilter} grievances`, 'Error');
        this.loading = false;
      },
    });
  }

  onFilterChange(): void {
    console.log(`🔄 [ESCALATIONS] Filter changed to: ${this.selectedFilter}`);

    // Reset to first page when filter changes
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }

    this.loadGrievances();
  }

  onPageChange(event: PageEvent): void {
    console.log(`📄 [ESCALATIONS] Page changed:`, event);
    this.loadGrievances();
  }

  assignGrievance(grievanceId: number): void {
    console.log(`📤 [ESCALATIONS] Assigning grievance: ${grievanceId}`);
    this.router.navigate(['/supervisor/assign', grievanceId]);
  }

  viewDetails(grievanceId: number): void {
    console.log(`👁️ [ESCALATIONS] Viewing grievance: ${grievanceId}`);
    this.router.navigate(['/supervisor/grievances', grievanceId]);
  }
}
