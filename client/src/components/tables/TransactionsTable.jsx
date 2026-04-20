import { formatCurrency, formatDate } from '../../utils/formatters';

function TransactionsTable({ transactions = [], onEditTransaction, onDeleteTransaction }) {
  return (
    <div className="card table-card">
      <div className="card-header">
        <div>
          <h2>Recent Transactions</h2>
          <p className="card-subtext">Manage your latest income and expense activity.</p>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Type</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-cell">
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.category}</td>
                  <td>
                    <span className={`type-pill ${item.type}`}>{item.type}</span>
                  </td>
                  <td>{formatDate(item.transaction_date)}</td>
                  <td className={item.type === 'income' ? 'positive' : 'negative'}>
                    {formatCurrency(item.amount)}
                  </td>
                  <td>{item.status}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn" onClick={() => onEditTransaction(item)}>
                        Edit
                      </button>
                      <button className="delete-btn" onClick={() => onDeleteTransaction(item.id)}>
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

export default TransactionsTable;