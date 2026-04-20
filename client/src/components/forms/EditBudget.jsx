import { useState } from 'react';

function EditBudget({ budget, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    category: budget?.category || '',
    monthly_limit: budget?.monthly_limit || '',
    color_class: budget?.color_class || 'fill-blue',
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

    if (!formData.category.trim()) {
      setError('Category is required.');
      return;
    }

    if (Number(formData.monthly_limit) <= 0) {
      setError('Monthly limit must be greater than 0.');
      return;
    }

    onSubmit(budget.id, {
      category: formData.category.trim(),
      monthly_limit: Number(formData.monthly_limit),
      color_class: formData.color_class,
    });
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      {error && <p className="form-error">{error}</p>}

      <input
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
        required
      />

      <input
        name="monthly_limit"
        type="number"
        placeholder="Monthly limit"
        value={formData.monthly_limit}
        onChange={handleChange}
        required
      />

      <select name="color_class" value={formData.color_class} onChange={handleChange}>
        <option value="fill-blue">Blue</option>
        <option value="fill-green">Green</option>
        <option value="fill-yellow">Yellow</option>
        <option value="fill-red">Red</option>
      </select>

      <div className="form-actions">
        <button type="button" className="secondary-btn" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="primary-btn">
          Update Budget
        </button>
      </div>
    </form>
  );
}

export default EditBudget;