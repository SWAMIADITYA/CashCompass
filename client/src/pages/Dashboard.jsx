import { useEffect, useMemo, useState } from 'react';
import { exportTransactionsToCsv } from '../utils/exportCsv';
import {
  FaArrowTrendUp,
  FaArrowTrendDown,
  FaWallet,
  FaTableList,
  FaPlus,
  FaDownload,
} from 'react-icons/fa6';

import DashboardLayout from '../components/layout/DashboardLayout';
import SummaryCard from '../components/cards/SummaryCard';
import BudgetCard from '../components/cards/BudgetCard';
import IncomeExpenseLineChart from '../components/charts/IncomeExpenseLineChart';
import ExpenseBarChart from '../components/charts/ExpenseBarChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import TransactionsTable from '../components/tables/TransactionsTable';
import TransactionModal from '../components/modals/TransactionModal';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';
import AddTransaction from '../components/forms/AddTransaction';
import EditTransaction from '../components/forms/EditTransaction';
import TransactionFilters from '../components/forms/TransactionFilters';

import {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../api/transactionApi';

import {
  getDashboardSummary,
  getMonthlyChartData,
  getCategoryChartData,
  getBudgetVsActual,
} from '../api/dashboardApi';

import { formatCurrency } from '../utils/formatters';

const initialFilters = {
  search: '',
  type: '',
  category: '',
  startDate: '',
  endDate: '',
};

function Dashboard({ currentPage, onNavigate, onLogout, user }) {
  const [summary, setSummary] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [budgetData, setBudgetData] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [filters, setFilters] = useState(initialFilters);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchStaticDashboardData = async () => {
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
      console.error('Failed to fetch dashboard analytics:', error);
      setError('Failed to load dashboard analytics.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (activeFilters = filters) => {
    try {
      setTableLoading(true);
      const response = await getAllTransactions(activeFilters);
      setTransactions(response.data || []);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setError('Failed to load transactions.');
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchStaticDashboardData();
  }, []);

  useEffect(() => {
    fetchTransactions(filters);
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const handleAddTransaction = async (formData) => {
    try {
      setError('');
      setMessage('');
      await createTransaction(formData);
      setShowAddModal(false);
      setMessage('Transaction added successfully.');
      fetchStaticDashboardData();
      fetchTransactions(filters);
    } catch (error) {
      console.error('Failed to add transaction:', error);
      setError('Failed to add transaction.');
    }
  };

  const handleUpdateTransaction = async (id, formData) => {
    try {
      setError('');
      setMessage('');
      await updateTransaction(id, formData);
      setSelectedTransaction(null);
      setMessage('Transaction updated successfully.');
      fetchStaticDashboardData();
      fetchTransactions(filters);
    } catch (error) {
      console.error('Failed to update transaction:', error);
      setError('Failed to update transaction.');
    }
  };

  const handleDeleteTransaction = async () => {
    try {
      if (!deleteId) return;

      setDeleteLoading(true);
      setError('');
      setMessage('');

      await deleteTransaction(deleteId);
      setDeleteId(null);
      setMessage('Transaction deleted successfully.');
      fetchStaticDashboardData();
      fetchTransactions(filters);
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      setError('Failed to delete transaction.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEditModal = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const categoryOptions = useMemo(() => {
    const values = transactions.map((item) => item.category).filter(Boolean);
    return [...new Set(values)].sort();
  }, [transactions]);

  return (
    <DashboardLayout
      user={user}
      onLogout={onLogout}
      currentPage={currentPage}
      onNavigate={onNavigate}
    >
      <div className="dashboard-content">
        <div className="top-bar">
          {/* <div>
            <h2 className="section-title">Overview</h2>
            <p className="section-subtitle">A complete snapshot of your financial activity.</p>
          </div> */}

          <div className="page-actions">
            <button
              className="secondary-btn"
              onClick={() => onNavigate('budgets')}
            >
              Manage Budgets
            </button>

            <button
              className="primary-btn add-btn"
              onClick={() => setShowAddModal(true)}
            >
              <FaPlus />
              Add Transaction
            </button>
          </div>
        </div>

        {message && <div className="alert success-alert">{message}</div>}
        {error && <div className="alert error-alert">{error}</div>}

        {loading ? (
          <p className="loading-text">Loading dashboard...</p>
        ) : (
          <>
            <section className="summary-grid">
              <SummaryCard
                title="Total Income"
                value={formatCurrency(summary?.totalIncome)}
                icon={<FaArrowTrendUp />}
                type="income"
              />
              <SummaryCard
                title="Total Expense"
                value={formatCurrency(summary?.totalExpense)}
                icon={<FaArrowTrendDown />}
                type="expense"
              />
              <SummaryCard
                title="Current Balance"
                value={formatCurrency(summary?.balance)}
                icon={<FaWallet />}
                type="balance"
              />
              <SummaryCard
                title="Transactions"
                value={summary?.totalTransactions || 0}
                icon={<FaTableList />}
                type="transactions"
              />
            </section>

            <section className="chart-grid">
              <IncomeExpenseLineChart data={monthlyData} />
              <CategoryPieChart data={categoryData} />
            </section>

            <section className="chart-grid single-bar">
              <ExpenseBarChart data={categoryData} />
            </section>

            <section className="table-tools-section">
              <div className="card filters-card">
                <div className="card-header filters-header">
                  <div>
                    <h2>Transaction Filters</h2>
                    <p className="card-subtext">
                      Search and narrow transactions by type, category, and date range.
                    </p>
                  </div>

                  <button
                    className="secondary-btn export-btn"
                    onClick={() => exportTransactionsToCsv(transactions)}
                    disabled={transactions.length === 0}
                  >
                    <FaDownload />
                    Export CSV
                  </button>
                </div>

                <TransactionFilters
                  filters={filters}
                  onChange={handleFilterChange}
                  onReset={handleResetFilters}
                  categories={categoryOptions}
                />
              </div>
            </section>

            <section className="bottom-grid">
              <div className="table-panel">
                {tableLoading && <p className="loading-text small-loading">Refreshing transactions...</p>}
                <TransactionsTable
                  transactions={transactions}
                  onEditTransaction={openEditModal}
                  onDeleteTransaction={(id) => setDeleteId(id)}
                />
              </div>
              <BudgetCard data={budgetData} />
            </section>
          </>
        )}

        {showAddModal && (
          <TransactionModal title="Add New Transaction" onClose={() => setShowAddModal(false)}>
            <AddTransaction
              onSubmit={handleAddTransaction}
              onClose={() => setShowAddModal(false)}
            />
          </TransactionModal>
        )}

        {selectedTransaction && (
          <TransactionModal
            title="Edit Transaction"
            onClose={() => setSelectedTransaction(null)}
          >
            <EditTransaction
              transaction={selectedTransaction}
              onSubmit={handleUpdateTransaction}
              onClose={() => setSelectedTransaction(null)}
            />
          </TransactionModal>
        )}

        {deleteId && (
          <DeleteConfirmModal
            onClose={() => setDeleteId(null)}
            onConfirm={handleDeleteTransaction}
            loading={deleteLoading}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;