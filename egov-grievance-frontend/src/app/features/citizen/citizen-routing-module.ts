import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard';
import { LodgeGrievanceComponent } from './lodge-grievance/lodge-grievance';
import { MyGrievancesComponent } from './my-grievances/my-grievances';
import { GrievanceDetailsComponent } from './grievance-details/grievance-details';
import { FeedbackFormComponent } from './feedback-form/feedback-form';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'lodge-grievance',
    component: LodgeGrievanceComponent,
  },
  {
    path: 'my-grievances',
    component: MyGrievancesComponent,
  },
  {
    path: 'grievance/:id',
    component: GrievanceDetailsComponent,
  },
  {
    path: 'feedback/:grievanceId',
    component: FeedbackFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CitizenRoutingModule {}
