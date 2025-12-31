export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/me',
    VERIFY: '/api/auth/verify'
  },
  DOCUMENTS: {
    BASE: '/api/documents',
    UPLOAD: '/api/documents/upload',
    SEARCH: '/api/documents/search'
  }
};