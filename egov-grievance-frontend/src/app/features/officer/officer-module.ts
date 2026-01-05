// src/app/features/officer/officer.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { OfficerRoutingModule } from './officer-routing-module';
import { SharedModule } from '../../shared/shared-module';

import { DashboardComponent } from './dashboard/dashboard';
import { GrievanceListComponent } from './grievance-list/grievance-list';
import { ResolveGrievanceComponent } from './resolve-grievance/resolve-grievance';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [DashboardComponent, GrievanceListComponent, ResolveGrievanceComponent],
  imports: [
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    OfficerRoutingModule,
    MatIconModule,
    MatCardModule,
  ],
})
export class OfficerModule {}
