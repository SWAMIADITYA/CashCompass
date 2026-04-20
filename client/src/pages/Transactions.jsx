import { useEffect, useMemo, useState } from 'react';
import { FaDownload, FaPlus } from 'react-icons/fa6';

import DashboardLayout from '../components/layout/DashboardLayout';
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

import { exportTransactionsToCsv } from '../utils/exportCsv';

const initialFilters = {
  search: '',
  type: '',
  category: '',
  startDate: '',
  endDate: '',
};

function Transactions({ currentPage, onNavigate, onLogout, user }) {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState(initialFilters);

  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchTransactions = async (activeFilters = filters) => {
    try {
      setTableLoading(true);
      setError('');
      const response = await getAllTransactions(activeFilters);
      setTransactions(response.data || []);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setError('Failed to load transactions.');
    } finally {
      setLoading(false);
      setTableLoading(false);
    }
  };

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
      await fetchTransactions(filters);
      setShowAddModal(false);
      setMessage('Transaction added successfully.');
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
      await fetchTransactions(filters);
      setSelectedTransaction(null);
      setMessage('Transaction updated successfully.');
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
      await fetchTransactions(filters);
      setDeleteId(null);
      setMessage('Transaction deleted successfully.');
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      setError('Failed to delete transaction.');
    } finally {
      setDeleteLoading(false);
    }
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
          <div>
            <h2 className="section-title">Transactions</h2>
            <p className="section-subtitle">
              View, filter, export, and manage all your financial entries.
            </p>
          </div>

          <div className="page-actions">
            <button
              className="secondary-btn"
              onClick={() => exportTransactionsToCsv(transactions)}
              disabled={transactions.length === 0}
            >
              <FaDownload />
              Export CSV
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

        <section className="table-tools-section">
          <div className="card filters-card">
            <div className="card-header filters-header">
              <div>
                <h2>Filters</h2>
                <p className="card-subtext">
                  Search by keyword, type, category, and date range.
                </p>
              </div>
            </div>

            <TransactionFilters
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
              categories={categoryOptions}
            />
          </div>
        </section>

        <section className="bottom-grid single-panel">
          <div className="table-panel">
            {loading ? (
              <p className="loading-text">Loading transactions...</p>
            ) : (
              <>
                {tableLoading && (
                  <p className="loading-text small-loading">Refreshing transactions...</p>
                )}

                <TransactionsTable
                  transactions={transactions}
                  onEditTransaction={setSelectedTransaction}
                  onDeleteTransaction={(id) => setDeleteId(id)}
                />
              </>
            )}
          </div>
        </section>

        {showAddModal && (
          <TransactionModal
            title="Add New Transaction"
            onClose={() => setShowAddModal(false)}
          >
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

export default Transactions;