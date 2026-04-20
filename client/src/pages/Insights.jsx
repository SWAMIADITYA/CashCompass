import { useEffect, useMemo, useState } from 'react';
import {
  FaArrowTrendDown,
  FaArrowTrendUp,
  FaBullseye,
  FaChartLine,
} from 'react-icons/fa6';

import DashboardLayout from '../components/layout/DashboardLayout';
import SummaryCard from '../components/cards/SummaryCard';
import IncomeExpenseLineChart from '../components/charts/IncomeExpenseLineChart';
import ExpenseBarChart from '../components/charts/ExpenseBarChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';

import {
  getDashboardSummary,
  getMonthlyChartData,
  getCategoryChartData,
  getBudgetVsActual,
} from '../api/dashboardApi';

import { formatCurrency } from '../utils/formatters';

function Insights({ currentPage, onNavigate, onLogout, user }) {
  const [summary, setSummary] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [budgetData, setBudgetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError('');

      const [summaryRes, monthlyRes, categoryRes, budgetRes] = await Promise.all([
        getDashboardSummary(),
        getMonthlyChartData(),
        getCategoryChartData(),
        getBudgetVsActual(),
      ]);

      setSummary(summaryRes.data || null);
      setMonthlyData(monthlyRes.data || []);
      setCategoryData(categoryRes.data || []);
      setBudgetData(budgetRes.data || []);
    } catch (error) {
      console.error('Failed to load insights:', error);
      setError('Failed to load insights.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const topSpendingCategory = useMemo(() => {
    if (!categoryData.length) return null;

    return [...categoryData].sort((a, b) => Number(b.amount) - Number(a.amount))[0];
  }, [categoryData]);

  const overBudgetCount = useMemo(() => {
    return budgetData.filter(
      (item) => Number(item.actual) > Number(item.monthly_limit)
    ).length;
  }, [budgetData]);

  const savingsRate = useMemo(() => {
    const income = Number(summary?.totalIncome || 0);
    const expense = Number(summary?.totalExpense || 0);

    if (!income) return 0;
    return (((income - expense) / income) * 100).toFixed(1);
  }, [summary]);

  return (
    <DashboardLayout
      user={user}
      onLogout={onLogout}
      currentPage={currentPage}
      onNavigate={onNavigate}
    >
      <div className="dashboard-content">
        <div className="top-bar">
          <div>
            <h2 className="section-title">Insights</h2>
            <p className="section-subtitle">
              Explore trends, spending patterns, and budget performance.
            </p>
          </div>
        </div>

        {error && <div className="alert error-alert">{error}</div>}

        {loading ? (
          <p className="loading-text">Loading insights...</p>
        ) : (
          <>
            <section className="summary-grid">
              <SummaryCard
                title="Savings Rate"
                value={`${savingsRate}%`}
                icon={<FaBullseye />}
                type="balance"
              />
              <SummaryCard
                title="Top Spending Category"
                value={
                  topSpendingCategory
                    ? `${topSpendingCategory.category}`
                    : 'No data'
                }
                icon={<FaArrowTrendDown />}
                type="expense"
              />
              <SummaryCard
                title="Top Category Spend"
                value={
                  topSpendingCategory
                    ? formatCurrency(topSpendingCategory.amount)
                    : formatCurrency(0)
                }
                icon={<FaChartLine />}
                type="transactions"
              />
              <SummaryCard
                title="Over Budget Categories"
                value={overBudgetCount}
                icon={<FaArrowTrendUp />}
                type="income"
              />
            </section>

            <section className="chart-grid">
              <IncomeExpenseLineChart data={monthlyData} />
              <CategoryPieChart data={categoryData} />
            </section>

            <section className="chart-grid single-bar">
              <ExpenseBarChart data={categoryData} />
            </section>

          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Insights;