// src/app/core/models/dashboard.model.ts
export interface OfficerDashboardStats {
  totalGrievances?: number;
  openIssues: number;
  assignedToMe: number;
  assignedToMeIds: number[];
  inReview: number;
  resolved: number;
  closed: number;
  escalated: number;
  statusBreakdown?: { [key: string]: number };
}

export interface CitizenDashboardStats {
  totalGrievances: number;
  submitted: number;
  assigned: number;
  inReview: number;
  resolved: number;
  closed: number;
  escalated: number;
}

// ✅ Fixed: Added missing properties
export interface SupervisorDashboardStats {
  total: number; // renamed from totalGrievances for consistency
  escalated: number;
  resolved: number;
  assigned: number; // ✅ Added
  inReview: number; // ✅ Added
  openIssues: number; // ✅ Added
  pendingAssignment?: number;
  departmentPerformance?: {
    averageResolutionTime: number;
    resolvedToday: number;
    resolvedThisWeek: number;
  };
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalGrievances: number;
  totalDepartments: number;
  activeOfficers: number;
  grievancesByStatus: { [key: string]: number };
  grievancesByDepartment: { [key: string]: number };
  systemHealth: {
    averageResolutionTime: number;
    citizenSatisfaction: number;
  };
}
