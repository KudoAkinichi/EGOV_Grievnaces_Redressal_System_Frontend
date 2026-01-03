export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  apiTimeout: 30000,
  tokenKey: 'egov_token',
  userKey: 'egov_user',
  userIdKey: 'egov_user_id',
  dashboardRefreshInterval: 30000, // 30 seconds
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
};
