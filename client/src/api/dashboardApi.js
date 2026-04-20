import api from './axios';

export const getDashboardSummary = async () => {
  const response = await api.get('/dashboard/summary');
  return response.data;
};

export const getMonthlyChartData = async () => {
  const response = await api.get('/dashboard/monthly');
  return response.data;
};

export const getCategoryChartData = async () => {
  const response = await api.get('/dashboard/categories');
  return response.data;
};

export const getBudgetVsActual = async () => {
  const response = await api.get('/dashboard/budget-vs-actual');
  return response.data;
};