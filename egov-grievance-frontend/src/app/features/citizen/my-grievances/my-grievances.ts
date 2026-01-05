import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GrievanceService } from '../../../core/services/grievance.service';
import { Grievance, GrievanceStatus } from '../../../core/models/grievance.model';

@Component({
  selector: 'app-my-grievances',
  standalone: false,
  templateUrl: './my-grievances.html',
  styleUrls: ['./my-grievances.scss'],
})
export class MyGrievancesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  allGrievances: Grievance[] = [];
  displayedColumns = ['grievanceNumber', 'title', 'status', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<Grievance>([]);
  loading = true;
  selectedTab = 0;

  constructor(private grievanceService: GrievanceService, private router: Router) {}

  ngOnInit(): void {
    this.loadGrievances();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadGrievances(): void {
    this.loading = true;
    this.grievanceService.getMyGrievances(0, 1000).subscribe({
      next: (response) => {
        if (response.success && response.data.content) {
          this.allGrievances = response.data.content;
          this.filterGrievances();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading grievances:', error);
        this.loading = false;
      },
    });
  }

  onTabChange(index: number): void {
    this.selectedTab = index;
    this.filterGrievances();
  }

  filterGrievances(): void {
    let filtered: Grievance[] = [];

    switch (this.selectedTab) {
      case 0: // Open
        filtered = this.allGrievances.filter((g) =>
          [
            GrievanceStatus.SUBMITTED,
            GrievanceStatus.ASSIGNED,
            GrievanceStatus.IN_REVIEW,
            GrievanceStatus.RESOLVED,
          ].includes(g.status)
        );
        break;
      case 1: // Closed
        filtered = this.allGrievances.filter((g) => g.status === GrievanceStatus.CLOSED);
        break;
      case 2: // Escalated
        filtered = this.allGrievances.filter((g) => g.status === GrievanceStatus.ESCALATED);
        break;
    }

    this.dataSource.data = filtered;
  }

  viewDetails(grievanceId: number): void {
    this.router.navigate(['/citizen/grievance', grievanceId]);
  }

  getOpenCount(): number {
    return this.allGrievances.filter((g) =>
      [
        GrievanceStatus.SUBMITTED,
        GrievanceStatus.ASSIGNED,
        GrievanceStatus.IN_REVIEW,
        GrievanceStatus.RESOLVED,
      ].includes(g.status)
    ).length;
  }

  getClosedCount(): number {
    return this.allGrievances.filter((g) => g.status === GrievanceStatus.CLOSED).length;
  }

  getEscalatedCount(): number {
    return this.allGrievances.filter((g) => g.status === GrievanceStatus.ESCALATED).length;
  }
}
