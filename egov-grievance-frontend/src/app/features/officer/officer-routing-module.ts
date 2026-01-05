// src/app/features/officer/officer-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { GrievanceListComponent } from './grievance-list/grievance-list';
import { ResolveGrievanceComponent } from './resolve-grievance/resolve-grievance';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'grievances', component: GrievanceListComponent },
  { path: 'resolve/:id', component: ResolveGrievanceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfficerRoutingModule {}
