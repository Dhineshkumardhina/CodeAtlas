import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Interceptor to attach Authorization tokens
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authenticated user services
export const registerUser = async (userData) => {
  const response = await API.post('/user/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await API.post('/user/login', credentials);
  return response.data;
};

export const getMe = async () => {
  const response = await API.get('/user/me');
  return response.data;
};

// Repository analysis services
export const analyzeRepository = async (repoUrl) => {
  const response = await API.post('/repository/analyze', { repoUrl });
  return response.data;
};

export const getAnalysisHistory = async () => {
  const response = await API.get('/repository/history');
  return response.data;
};

export const deleteAnalysisFromHistory = async (id) => {
  const response = await API.delete(`/repository/${id}`);
  return response.data;
};

export default API;
