export const environment = {
  production: true,

  // API Configuration - CHANGE THIS TO YOUR PRODUCTION URL
  apiUrl: 'https://your-production-domain.com/api',
  apiTimeout: 60000, // 60 seconds for production

  // Authentication Endpoints
  authEndpoints: {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    changePassword: '/auth/change-password',
    validateToken: '/auth/validate',
    getCurrentUser: '/auth/me',
  },

  // User Management Endpoints (Admin)
  userEndpoints: {
    getAllUsers: '/users',
    getUserById: '/users/:id',
    getUsersByRole: '/users/by-role/:role',
    getUsersByDepartment: '/users/by-department/:departmentId',
    createOfficer: '/users/officers',
    updateUser: '/users/:id',
    assignRole: '/users/:id/role',
    assignDepartment: '/users/:id/department',
    deleteUser: '/users/:id',
    getAvailableOfficers: '/users/officers/available/:departmentId',
  },

  // Department Endpoints
  departmentEndpoints: {
    getAllDepartments: '/departments',
    getDepartmentById: '/departments/:id',
    createDepartment: '/departments',
    updateDepartment: '/departments/:id',
    deleteDepartment: '/departments/:id',
    getDepartmentCategories: '/departments/:id/categories',
    createCategory: '/departments/:id/categories',
    getAllCategories: '/departments/categories',
  },

  // Grievance Endpoints
  grievanceEndpoints: {
    lodgeGrievance: '/grievances',
    getMyGrievances: '/grievances/my-grievances',
    getGrievanceById: '/grievances/:id',
    updateStatus: '/grievances/:id/status',
    assignGrievance: '/grievances/:id/assign/:officerId',
    autoAssign: '/grievances/:id/auto-assign',
    escalateGrievance: '/grievances/:id/escalate',
    withdrawGrievance: '/grievances/:id',
    getGrievanceHistory: '/grievances/:id/history',

    // Documents
    uploadDocument: '/grievances/:id/documents',
    getDocuments: '/grievances/:id/documents',
    getDocument: '/grievances/documents/:docId',
    deleteDocument: '/grievances/documents/:docId',

    // Comments
    addComment: '/grievances/:id/comments',
    getComments: '/grievances/:id/comments',

    // Dashboards
    getCitizenDashboard: '/grievances/dashboard/citizen',
    getOfficerDashboard: '/grievances/dashboard/officer',
    getSupervisorDashboard: '/grievances/dashboard/supervisor',
    getAdminDashboard: '/grievances/dashboard/admin',

    // Reports
    getDepartmentWiseReport: '/grievances/reports/by-department',
    getCategoryWiseReport: '/grievances/reports/by-category',
    getResolutionTimeReport: '/grievances/reports/resolution-time',
  },

  // Feedback Endpoints
  feedbackEndpoints: {
    submitFeedback: '/feedbacks',
    getFeedbackByGrievance: '/feedbacks/grievance/:id',
    checkFeedbackExists: '/feedbacks/grievance/:id/exists',
    getMyFeedbacks: '/feedbacks/my-feedbacks',
    getFeedbackStats: '/feedbacks/stats',
  },

  // Storage Keys (LocalStorage)
  storageKeys: {
    token: 'egov_token',
    user: 'egov_user',
    userId: 'egov_user_id',
    userRole: 'egov_user_role',
    userEmail: 'egov_user_email',
    departmentId: 'egov_department_id',
  },

  // File Upload Configuration
  fileUpload: {
    maxFileSize: 5242880, // 5MB in bytes
    allowedFileTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    allowedFileExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx'],
  },

  // Pagination Configuration
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 25, 50, 100],
  },

  // Dashboard Configuration
  dashboard: {
    refreshInterval: 60000, // 60 seconds in production
    autoRefresh: true,
  },

  // Roles
  roles: {
    CITIZEN: 'CITIZEN',
    DEPT_OFFICER: 'DEPT_OFFICER',
    SUPERVISOR: 'SUPERVISOR',
    ADMIN: 'ADMIN',
  },

  // Grievance Status
  grievanceStatus: {
    SUBMITTED: 'SUBMITTED',
    ASSIGNED: 'ASSIGNED',
    IN_REVIEW: 'IN_REVIEW',
    RESOLVED: 'RESOLVED',
    CLOSED: 'CLOSED',
    ESCALATED: 'ESCALATED',
  },

  // Grievance Priority
  grievancePriority: {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    CRITICAL: 'CRITICAL',
  },

  // Status Colors (for badges/chips)
  statusColors: {
    SUBMITTED: 'info',
    ASSIGNED: 'primary',
    IN_REVIEW: 'warning',
    RESOLVED: 'success',
    CLOSED: 'secondary',
    ESCALATED: 'danger',
  },

  // Priority Colors
  priorityColors: {
    LOW: 'success',
    MEDIUM: 'info',
    HIGH: 'warning',
    CRITICAL: 'danger',
  },

  // Date Format
  dateFormat: 'MMM dd, yyyy',
  dateTimeFormat: 'MMM dd, yyyy HH:mm',

  // Toast/Notification Configuration
  toast: {
    duration: 3000,
    position: 'top-right',
  },

  // Auto-escalation Time
  autoEscalationHours: 72,

  // Feature Flags
  features: {
    enableAutoEscalation: true,
    enableComments: true,
    enableDocumentUpload: true,
    enableFeedback: true,
    enableNotifications: true,
  },

  // Logging
  logging: {
    enableConsoleLog: false, // Disable in production
    enableErrorLog: true,
  },
};
