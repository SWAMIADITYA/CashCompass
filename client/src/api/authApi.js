import api from './axios';

export const registerUser = (data) => {
  return api.post('/api/auth/register', data);
};

export const loginUser = (data) => {
  return api.post('/api/auth/login', data);
};

export const getCurrentUser = () => {
  return api.get('/api/auth/me');
};