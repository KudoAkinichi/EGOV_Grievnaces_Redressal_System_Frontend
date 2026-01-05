import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles: UserRole[];
}

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class SidebarComponent implements OnInit {
  menuItems: MenuItem[] = [];
  currentRole: UserRole | null = null;

  private allMenuItems: MenuItem[] = [
    // Citizen Menu
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/citizen/dashboard',
      roles: [UserRole.CITIZEN],
    },
    {
      label: 'Lodge Grievance',
      icon: 'add_circle',
      route: '/citizen/lodge-grievance',
      roles: [UserRole.CITIZEN],
    },
    {
      label: 'My Grievances',
      icon: 'list',
      route: '/citizen/my-grievances',
      roles: [UserRole.CITIZEN],
    },

    // Officer Menu
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/officer/dashboard',
      roles: [UserRole.DEPT_OFFICER],
    },
    {
      label: 'Grievances',
      icon: 'assignment',
      route: '/officer/grievances',
      roles: [UserRole.DEPT_OFFICER],
    },

    // Supervisor Menu
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/supervisor/dashboard',
      roles: [UserRole.SUPERVISOR],
    },
    {
      label: 'All Grievances',
      icon: 'list_alt',
      route: '/supervisor/grievances',
      roles: [UserRole.SUPERVISOR],
    },
    {
      label: 'Escalations',
      icon: 'priority_high',
      route: '/supervisor/escalations',
      roles: [UserRole.SUPERVISOR],
    },

    // Admin Menu
    { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard', roles: [UserRole.ADMIN] },
    {
      label: 'Departments',
      icon: 'business',
      route: '/admin/departments',
      roles: [UserRole.ADMIN],
    },
    { label: 'Users', icon: 'people', route: '/admin/users', roles: [UserRole.ADMIN] },
    {
      label: 'Create Officer',
      icon: 'person_add',
      route: '/admin/create-officer',
      roles: [UserRole.ADMIN],
    },
    { label: 'Reports', icon: 'assessment', route: '/admin/reports', roles: [UserRole.ADMIN] },
  ];

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.currentRole = this.authService.getCurrentUserRole();
    this.filterMenuItems();
  }

  filterMenuItems(): void {
    if (!this.currentRole) return;

    this.menuItems = this.allMenuItems.filter((item) => item.roles.includes(this.currentRole!));
  }

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}
