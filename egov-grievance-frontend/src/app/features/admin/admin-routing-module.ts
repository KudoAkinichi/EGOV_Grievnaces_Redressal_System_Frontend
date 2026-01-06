// src/app/features/admin/admin-routing-module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard';
import { ManageDepartmentsComponent } from './manage-departments/manage-departments';
import { ManageUsersComponent } from './manage-users/manage-users';
import { CreateOfficerComponent } from './create-officer/create-officer';
import { ReportsComponent } from './reports/reports';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'departments', component: ManageDepartmentsComponent },
  { path: 'users', component: ManageUsersComponent },
  { path: 'create-officer', component: CreateOfficerComponent },
  { path: 'reports', component: ReportsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
