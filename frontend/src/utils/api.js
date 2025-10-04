import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// Courses API
export const coursesAPI = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
};

// Timetable API
export const timetableAPI = {
  get: () => api.get('/timetable'),
  save: (data) => api.post('/timetable', data),
  delete: () => api.delete('/timetable'),
};

// Quiz API
export const quizAPI = {
  getAll: () => api.get('/quizzes'),
  getById: (id) => api.get(`/quizzes/${id}`),
  create: (data) => api.post('/quizzes', data),
  update: (id, data) => api.put(`/quizzes/${id}`, data),
  delete: (id) => api.delete(`/quizzes/${id}`),
  submitAnswer: (quizId, data) => api.post(`/quizzes/${quizId}/submit`, data),
  getResults: (quizId) => api.get(`/quizzes/${quizId}/results`),
  getAllResults: () => api.get('/quizzes/results/all'),
};

// Feedback API
export const feedbackAPI = {
  getAll: () => api.get('/feedback'),
  submit: (data) => api.post('/feedback', data),
};

// Lost and Found API
export const lostFoundAPI = {
  getAll: () => api.get('/lost-found'),
  getById: (id) => api.get(`/lost-found/${id}`),
  create: (data) => api.post('/lost-found', data),
  update: (id, data) => api.put(`/lost-found/${id}`, data),
  delete: (id) => api.delete(`/lost-found/${id}`),
};

// Project Ideas API
export const projectAPI = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  submit: (data) => api.post('/projects', data),
  updateStatus: (id, data) => api.put(`/projects/${id}/status`, data),
};

// Bus Reservation API
export const busAPI = {
  getRoutes: () => api.get('/bus/routes'),
  getBookings: () => api.get('/bus/bookings'),
  createBooking: (data) => api.post('/bus/bookings', data),
  cancelBooking: (id) => api.delete(`/bus/bookings/${id}`),
};

// Grade Appeal API
export const gradeAppealAPI = {
  getAll: () => api.get('/grade-appeals'),
  getById: (id) => api.get(`/grade-appeals/${id}`),
  submit: (data) => api.post('/grade-appeals', data),
  updateStatus: (id, data) => api.put(`/grade-appeals/${id}/status`, data),
};
