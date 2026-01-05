// src/app/features/supervisor/escalations/escalations.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SupervisorService } from '../services/supervisor';
import { Grievance } from '../../../core/models/grievance.model';

@Component({
  selector: 'app-escalations',
  templateUrl: './escalations.html',
  styleUrls: ['./escalations.scss'],
  standalone: false,
})
export class EscalationsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = ['grievanceNumber', 'title', 'status', 'actions'];
  dataSource = new MatTableDataSource<Grievance>([]);
  selectedFilter: 'all' | 'ESCALATED' | 'ASSIGNED' | 'IN_REVIEW' = 'ESCALATED';
  loading = true;

  constructor(private supervisorService: SupervisorService, private router: Router) {}

  ngOnInit(): void {
    this.loadGrievances();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadGrievances(): void {
    this.loading = true;

    if (this.selectedFilter === 'all') {
      this.supervisorService.getAllGrievances(0, 1000).subscribe({
        next: (res) => {
          if (res.success && res.data?.content) {
            this.dataSource.data = res.data.content;
          }
          this.loading = false;
        },
      });
    } else {
      this.supervisorService.getGrievancesByStatus(this.selectedFilter, 0, 1000).subscribe({
        next: (res) => {
          if (res.success && res.data?.content) {
            this.dataSource.data = res.data.content;
          }
          this.loading = false;
        },
      });
    }
  }

  onFilterChange(): void {
    this.loadGrievances();
  }

  assignGrievance(grievanceId: number): void {
    this.router.navigate(['/supervisor/assign', grievanceId]);
  }
}
