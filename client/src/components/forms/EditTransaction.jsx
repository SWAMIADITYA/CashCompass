import { useState } from 'react';

function EditTransaction({ transaction, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    title: transaction?.title || '',
    amount: transaction?.amount || '',
    category: transaction?.category || '',
    type: transaction?.type || 'expense',
    transaction_date: transaction?.transaction_date?.slice(0, 10) || '',
    notes: transaction?.notes || '',
    status: transaction?.status || 'completed',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.category.trim()) {
      setError('Title and category are required.');
      return;
    }

    if (Number(formData.amount) <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }

    onSubmit(transaction.id, {
      ...formData,
      title: formData.title.trim(),
      category: formData.category.trim(),
      notes: formData.notes.trim(),
      amount: Number(formData.amount),
    });
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      {error && <p className="form-error">{error}</p>}

      <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
      <input name="amount" type="number" placeholder="Amount" value={formData.amount} onChange={handleChange} required />
      <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
      <select name="type" value={formData.type} onChange={handleChange}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <input name="transaction_date" type="date" value={formData.transaction_date} onChange={handleChange} required />
      <input name="notes" placeholder="Notes" value={formData.notes} onChange={handleChange} />
      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
      </select>

      <div className="form-actions">
        <button type="button" className="secondary-btn" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="primary-btn">
          Update Transaction
        </button>
      </div>
    </form>
  );
}

export default EditTransaction;