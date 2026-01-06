// src/app/features/admin/manage-users/manage-users.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserManagementService } from '../services/user-management';
import { User } from '../../../core/models/index';
import { ToastrService } from 'ngx-toastr';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-manage-users',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Manage Users</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <table mat-table [dataSource]="dataSource" class="users-table">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let user">{{ user.id }}</td>
          </ng-container>
          <ng-container matColumnDef="fullName">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let user">{{ user.fullName }}</td>
          </ng-container>
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let user">{{ user.email }}</td>
          </ng-container>
          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef>Role</th>
            <td mat-cell *matCellDef="let user">{{ user.role }}</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
        <mat-paginator
          [length]="totalElements"
          [pageSize]="pageSize"
          (page)="onPageChange($event)"
        ></mat-paginator>
      </mat-card-content>
    </mat-card>
  `,
  styles: ['.users-table { width: 100%; }'],
  standalone: false,
})
export class ManageUsersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns = ['id', 'fullName', 'email', 'role'];
  dataSource = new MatTableDataSource<User>([]);
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;

  constructor(private userService: UserManagementService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.dataSource.data = res.data.content || [];
          this.totalElements = res.data.totalElements || 0;
          console.log('✅ Users loaded:', this.totalElements);
        }
      },
      error: (err) => {
        console.error('❌ Error loading users:', err);
        this.toastr.error('Failed to load users');
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }
}
