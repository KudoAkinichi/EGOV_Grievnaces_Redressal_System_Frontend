import { Pipe, PipeTransform } from '@angular/core';
import { UserRole } from '../../core/models/user.model';

@Pipe({
  name: 'roleDisplay',
  standalone: false,
})
export class RoleDisplayPipe implements PipeTransform {
  transform(role: UserRole): string {
    switch (role) {
      case UserRole.CITIZEN:
        return 'Citizen';
      case UserRole.DEPT_OFFICER:
        return 'Department Officer';
      case UserRole.SUPERVISOR:
        return 'Supervisor';
      case UserRole.ADMIN:
        return 'Administrator';
      default:
        return role;
    }
  }
}
