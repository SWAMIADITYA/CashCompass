import { formatCurrency } from '../../utils/formatters';

function BudgetTable({ budgets = [], onEditBudget, onDeleteBudget }) {
  return (
    <div className="card table-card">
      <div className="card-header">
        <div>
          <h2>Budget Limits</h2>
          <p className="card-subtext">Manage monthly limits by category.</p>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Monthly Limit</th>
              <th>Color Style</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {budgets.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-cell">
                  No budgets found.
                </td>
              </tr>
            ) : (
              budgets.map((item) => (
                <tr key={item.id}>
                  <td>{item.category}</td>
                  <td>{formatCurrency(item.monthly_limit)}</td>
                  <td>
                    <span className={`budget-color-preview ${item.color_class}`}>
                      {item.color_class}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn" onClick={() => onEditBudget(item)}>
                        Edit
                      </button>
                      <button className="delete-btn" onClick={() => onDeleteBudget(item.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BudgetTable;