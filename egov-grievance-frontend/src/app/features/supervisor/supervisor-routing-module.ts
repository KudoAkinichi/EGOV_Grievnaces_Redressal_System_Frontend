import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { EscalationsComponent } from './escalations/escalations';
import { AssignGrievanceComponent } from './assign-grievance/assign-grievance';
import { roleGuard } from '../../core/guards/role-guard.guard';
import { UserRole } from '../../core/models';

const routes: Routes = [
  {
    path: '',
    canActivate: [roleGuard([UserRole.SUPERVISOR])],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'grievances', component: EscalationsComponent },
      { path: 'escalations', component: EscalationsComponent },
      { path: 'assign/:id', component: AssignGrievanceComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupervisorRoutingModule {}
