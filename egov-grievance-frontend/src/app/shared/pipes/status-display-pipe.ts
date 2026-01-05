import { Pipe, PipeTransform } from '@angular/core';
import { GrievanceStatus } from '../../core/models/grievance.model';

@Pipe({
  name: 'statusDisplay',
  standalone: false,
})
export class StatusDisplayPipe implements PipeTransform {
  transform(status: GrievanceStatus): string {
    switch (status) {
      case GrievanceStatus.SUBMITTED:
        return 'Submitted';
      case GrievanceStatus.ASSIGNED:
        return 'Assigned';
      case GrievanceStatus.IN_REVIEW:
        return 'In Review';
      case GrievanceStatus.RESOLVED:
        return 'Resolved';
      case GrievanceStatus.CLOSED:
        return 'Closed';
      case GrievanceStatus.ESCALATED:
        return 'Escalated';
      default:
        return status;
    }
  }
}
