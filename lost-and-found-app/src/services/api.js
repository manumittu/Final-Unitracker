import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to:`, config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('Backend server is not running! Please start the server.');
    }
    
    if (error.response) {
      // Server responded with error
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      // Request was made but no response
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Lost Items API
export const lostItemsAPI = {
  create: (data) => api.post('/lost-items', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  getAll: () => api.get('/lost-items'),
  getById: (id) => api.get(`/lost-items/${id}`),
  update: (id, data) => api.put(`/lost-items/${id}`, data),
  delete: (id) => api.delete(`/lost-items/${id}`)
};

// Found Items API
export const foundItemsAPI = {
  create: (data) => api.post('/found-items', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  getAll: () => api.get('/found-items'),
  getById: (id) => api.get(`/found-items/${id}`),
  update: (id, data) => api.put(`/found-items/${id}`, data),
  delete: (id) => api.delete(`/found-items/${id}`)
};

export default api;