import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';

import DashboardLayout from '../components/layout/DashboardLayout';
import TransactionModal from '../components/modals/TransactionModal';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';
import BudgetTable from '../components/tables/BudgetTable';
import AddBudget from '../components/forms/AddBudget';
import EditBudget from '../components/forms/EditBudget';

import {
  getAllBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from '../api/budgetApi';

function Budgets({ currentPage, onNavigate, onLogout, user }) {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
 
  const fetchBudgets = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllBudgets();
      setBudgets(data || []);
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
      setError('Failed to load budgets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleAddBudget = async (formData) => {
    try {
      setError('');
      setMessage('');
      await createBudget(formData);
      await fetchBudgets();
      setShowAddModal(false);
      setMessage('Budget added successfully.');
    } catch (error) {
      console.error('Failed to add budget:', error);
      setError('Failed to add budget.');
    }
  };

  const handleUpdateBudget = async (id, formData) => {
    try {
      setError('');
      setMessage('');
      await updateBudget(id, formData);
      await fetchBudgets();
      setSelectedBudget(null);
      setMessage('Budget updated successfully.');
    } catch (error) {
      console.error('Failed to update budget:', error);
      setError('Failed to update budget.');
    }
  };

  const handleDeleteBudget = async () => {
    try {
      if (!deleteId) return;

      setDeleteLoading(true);
      setError('');
      setMessage('');
      await deleteBudget(deleteId);
      await fetchBudgets();
      setDeleteId(null);
      setMessage('Budget deleted successfully.');
    } catch (error) {
      console.error('Failed to delete budget:', error);
      setError('Failed to delete budget.');
    } finally {
      setDeleteLoading(false);
    }
  };

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
            <h2 className="section-title">Budget Management</h2>
            <p className="section-subtitle">Create and manage monthly category limits.</p>
          </div>

          <div className="page-actions">
            <button
              className="secondary-btn"
              onClick={() => onNavigate('dashboard')}
            >
              Back to Dashboard
            </button>
            <button
              className="primary-btn add-btn"
              onClick={() => setShowAddModal(true)}
            >
              <FaPlus />
              Add Budget
            </button>
          </div>
        </div>

        {message && <div className="alert success-alert">{message}</div>}
        {error && <div className="alert error-alert">{error}</div>}

        {loading ? (
          <p className="loading-text">Loading budgets...</p>
        ) : (
          <BudgetTable
            budgets={budgets}
            onEditBudget={setSelectedBudget}
            onDeleteBudget={setDeleteId}
          />
        )}

        {showAddModal && (
          <TransactionModal
            title="Add Budget"
            onClose={() => setShowAddModal(false)}
          >
            <AddBudget
              onSubmit={handleAddBudget}
              onClose={() => setShowAddModal(false)}
            />
          </TransactionModal>
        )}

        {selectedBudget && (
          <TransactionModal
            title="Edit Budget"
            onClose={() => setSelectedBudget(null)}
          >
            <EditBudget
              budget={selectedBudget}
              onSubmit={handleUpdateBudget}
              onClose={() => setSelectedBudget(null)}
            />
          </TransactionModal>
        )}

        {deleteId && (
          <DeleteConfirmModal
            onClose={() => setDeleteId(null)}
            onConfirm={handleDeleteBudget}
            loading={deleteLoading}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

export default Budgets;