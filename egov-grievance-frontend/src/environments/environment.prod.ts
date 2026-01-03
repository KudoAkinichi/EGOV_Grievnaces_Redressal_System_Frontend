export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api',
  apiTimeout: 30000,
  tokenKey: 'egov_token',
  userKey: 'egov_user',
  userIdKey: 'egov_user_id',
  dashboardRefreshInterval: 60000, // 60 seconds in production
  maxFileSize: 5242880,
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
