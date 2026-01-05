import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { OfficerGrievanceService } from '../services/officer-grievance';
import { AuthService } from '../../../core/services/auth.service';
import { Grievance, GrievanceStatus } from '../../../core/models/grievance.model';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-grievance-list',
  templateUrl: './grievance-list.html',
  styleUrls: ['./grievance-list.scss'],
  standalone: false,
  // imports: [MatCardModule, MatIcon],
})
export class GrievanceListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  allGrievances: Grievance[] = [];
  displayedColumns = [
    'grievanceNumber',
    'title',
    'citizenName',
    'status',
    'priority',
    'createdAt',
    'actions',
  ];

  dataSource = new MatTableDataSource<Grievance>([]);
  loading = true;
  officerId!: number;
  selectedFilter = 'all';
  assignedGrievanceIds: number[] = [];

  statusFilters = [
    { value: 'all', label: 'All Grievances' },
    { value: 'assigned', label: 'Assigned to Me' },
    { value: GrievanceStatus.ASSIGNED, label: 'Assigned' },
    { value: GrievanceStatus.IN_REVIEW, label: 'In Review' },
    { value: GrievanceStatus.RESOLVED, label: 'Resolved' },
  ];

  constructor(
    private officerService: OfficerGrievanceService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.officerId = this.authService.getCurrentUserId()!;

    const filter = this.route.snapshot.queryParamMap.get('filter');
    if (filter) {
      this.selectedFilter = filter;
    }

    this.loadGrievances();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadGrievances(): void {
    this.loading = true;

    this.officerService.getDepartmentGrievances(0, 1000).subscribe({
      next: (response) => {
        if (response.success && response.data?.content) {
          this.allGrievances = response.data.content;
          this.applyFilter();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading grievances:', error);
        this.loading = false;
      },
    });
  }

  loadAssignedGrievances(): void {
    this.assignedGrievanceIds = this.allGrievances
      .filter((g) => g.assignedOfficerId === this.officerId)
      .map((g) => g.id);
  }

  onFilterChange(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    let filtered: Grievance[] = [];

    switch (this.selectedFilter) {
      case 'assigned':
        filtered = this.allGrievances.filter((g) => g.assignedOfficerId === this.officerId);
        break;

      case 'RESOLVED':
      case 'IN_REVIEW':
      case 'ASSIGNED':
        filtered = this.allGrievances.filter((g) => g.status === this.selectedFilter);
        break;

      case 'all':
      default:
        filtered = [...this.allGrievances];
    }

    // 🔑 CRITICAL PART
    this.dataSource.data = filtered;

    // 🔑 RE-ATTACH paginator
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.paginator.firstPage();
    }
  }

  viewDetails(grievanceId: number): void {
    this.router.navigate(['/officer/resolve', grievanceId]);
  }

  isAssignedToMe(grievance: Grievance): boolean {
    return grievance.assignedOfficerId === this.officerId;
  }
}
