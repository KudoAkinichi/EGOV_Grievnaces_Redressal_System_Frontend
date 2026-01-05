import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CitizenRoutingModule } from './citizen-routing-module';
import { SharedModule } from '../../shared/shared-module';

// Components
import { DashboardComponent } from './dashboard/dashboard';
import { LodgeGrievanceComponent } from './lodge-grievance/lodge-grievance';
import { MyGrievancesComponent } from './my-grievances/my-grievances';
import { GrievanceDetailsComponent } from './grievance-details/grievance-details';
import { FeedbackFormComponent } from './feedback-form/feedback-form';

@NgModule({
  declarations: [
    DashboardComponent,
    LodgeGrievanceComponent,
    MyGrievancesComponent,
    GrievanceDetailsComponent,
    FeedbackFormComponent,
  ],
  imports: [CommonModule, CitizenRoutingModule, SharedModule],
})
export class CitizenModule {}
