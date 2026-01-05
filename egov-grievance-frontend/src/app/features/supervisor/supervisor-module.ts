// src/app/features/supervisor/supervisor.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SupervisorRoutingModule } from './supervisor-routing-module';
import { SharedModule } from '../../shared/shared-module';

import { DashboardComponent } from './dashboard/dashboard';
import { EscalationsComponent } from './escalations/escalations';
import { AssignGrievanceComponent } from './assign-grievance/assign-grievance';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [DashboardComponent, EscalationsComponent, AssignGrievanceComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SupervisorRoutingModule,
    SharedModule,

    // Material
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class SupervisorModule {}
