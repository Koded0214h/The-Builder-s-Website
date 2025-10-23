// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);
          originalRequest.headers.Authorization = `Bearer ${access}`;
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed, logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login/', credentials);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/token/refresh/', { refresh: refreshToken });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile/');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.patch('/auth/profile/', userData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.post('/auth/change-password/', passwordData);
    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await api.post('/auth/verify-email/', { token });
    return response.data;
  },
};

// Projects API calls
export const projectsAPI = {
  getProjects: async () => {
    const response = await api.get('/projects/');
    return response.data;
  },

  getProject: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/`);
    return response.data;
  },

  createProject: async (projectData) => {
    const response = await api.post('/projects/', projectData);
    return response.data;
  },

  updateProject: async (projectId, projectData) => {
    const response = await api.patch(`/projects/${projectId}/`, projectData);
    return response.data;
  },

  deleteProject: async (projectId) => {
    const response = await api.delete(`/projects/${projectId}/`);
    return response.data;
  },
};

// Models API calls
export const modelsAPI = {
  getModels: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/models/`);
    return response.data;
  },

  createModel: async (projectId, modelData) => {
    const response = await api.post(`/projects/${projectId}/models/`, modelData);
    return response.data;
  },

  updateModel: async (projectId, modelId, modelData) => {
    const response = await api.patch(`/projects/${projectId}/models/${modelId}/`, modelData);
    return response.data;
  },

  deleteModel: async (projectId, modelId) => {
    const response = await api.delete(`/projects/${projectId}/models/${modelId}/`);
    return response.data;
  },

  createField: async (projectId, modelId, fieldData) => {
    const response = await api.post(`/projects/${projectId}/models/${modelId}/fields/`, fieldData);
    return response.data;
  },

  updateField: async (projectId, modelId, fieldId, fieldData) => {
    const response = await api.patch(`/projects/${projectId}/models/${modelId}/fields/${fieldId}/`, fieldData);
    return response.data;
  },

  deleteField: async (projectId, modelId, fieldId) => {
    const response = await api.delete(`/projects/${projectId}/models/${modelId}/fields/${fieldId}/`);
    return response.data;
  },
};

// Views API calls
export const viewsAPI = {
  getViews: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/views/`);
    return response.data;
  },

  createView: async (projectId, viewData) => {
    const response = await api.post(`/projects/${projectId}/views/`, viewData);
    return response.data;
  },

  updateView: async (projectId, viewId, viewData) => {
    const response = await api.patch(`/projects/${projectId}/views/${viewId}/`, viewData);
    return response.data;
  },

  deleteView: async (projectId, viewId) => {
    const response = await api.delete(`/projects/${projectId}/views/${viewId}/`);
    return response.data;
  },
};

// URLs API calls
export const urlsAPI = {
  getUrls: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/urls/`);
    return response.data;
  },

  createUrl: async (projectId, urlData) => {
    const response = await api.post(`/projects/${projectId}/urls/`, urlData);
    return response.data;
  },

  updateUrl: async (projectId, urlId, urlData) => {
    const response = await api.patch(`/projects/${projectId}/urls/${urlId}/`, urlData);
    return response.data;
  },

  deleteUrl: async (projectId, urlId) => {
    const response = await api.delete(`/projects/${projectId}/urls/${urlId}/`);
    return response.data;
  },
};

// Export the api instance for custom calls
export default api;