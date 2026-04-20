const dashboardService = require('../services/dashboardService');

const getSummary = async (req, res) => {
  try {
    const summary = await dashboardService.getSummaryData(req.user.id);
    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch summary data' });
  }
};

const getMonthlyData = async (req, res) => {
  try {
    const monthlyData = await dashboardService.getMonthlyChartData(req.user.id);
    res.status(200).json({ success: true, data: monthlyData });
  } catch (error) {
    console.error('Error fetching monthly chart data:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch monthly chart data' });
  }
};

const getCategoryData = async (req, res) => {
  try {
    const categoryData = await dashboardService.getCategoryBreakdown(req.user.id);
    res.status(200).json({ success: true, data: categoryData });
  } catch (error) {
    console.error('Error fetching category breakdown:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch category data' });
  }
};

const getBudgetComparison = async (req, res) => {
  try {
    const budgetData = await dashboardService.getBudgetVsActual(req.user.id);
    res.status(200).json({ success: true, data: budgetData });
  } catch (error) {
    console.error('Error fetching budget comparison:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch budget comparison' });
  }
};

module.exports = {
  getSummary,
  getMonthlyData,
  getCategoryData,
  getBudgetComparison,
};






