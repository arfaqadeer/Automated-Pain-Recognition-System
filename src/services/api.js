import axios from 'axios';

// Use a dev proxy or direct URL based on environment
const API_URL = import.meta.env.DEV ? '/api' : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
});

// Attach JWT token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept request errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('API request timed out');
    } else if (!error.response) {
      console.error('Network error - server might be down or CORS issue', error.message);
    } else {
      console.error('API Error:', error);
    }
    return Promise.reject(error);
  }
);

// API status check
export const checkApiStatus = () => api.get('/status');

// API functions
export const getPatient = (id) => api.get(`/patients/${id}`);
export const getPatients = () => api.get('/patients');
export const createPatient = (patientData) => api.post('/patients', patientData);
export const updatePatient = (id, patientData) => api.put(`/patients/${id}`, patientData);
export const deletePatient = (id) => api.delete(`/patients/${id}`);

export const getSessions = (patientId) => api.get(`/sessions?patient=${patientId}`);
export const getSession = (id) => api.get(`/sessions/${id}`);
export const createSession = (sessionData) => {
  return api.post('/sessions', sessionData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
export const updateSession = (id, sessionData) => api.put(`/sessions/${id}`, sessionData);
export const deleteSession = (id) => api.delete(`/sessions/${id}`);

export const predictPain = (formData) => {
  return api.post('/predict', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const generateReport = (sessionId) => {
  return api.get(`/generate-report/${sessionId}`, {
    responseType: 'blob'
  });
};

export const getPatientAnalytics = (patientId) => api.get(`/patient/${patientId}/analytics`);

export const registerUser = (userData) => api.post('/auth/signup', userData);
export const loginUser = (loginData) => api.post('/auth/login', loginData);

export default api; 