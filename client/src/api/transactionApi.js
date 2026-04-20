import api from './axios';

export const getAllTransactions = (filters = {}) => {
  return api.get('/transactions', { params: filters });
};

export const createTransaction = (data) => {
  return api.post('/transactions', data);
};

export const updateTransaction = (id, data) => {
  return api.put(`/transactions/${id}`, data);
};

export const deleteTransaction = (id) => {
  return api.delete(`/transactions/${id}`);
};