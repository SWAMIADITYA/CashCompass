import { formatCurrency } from '../../utils/formatters';

function BudgetCard({ data = [] }) {
  return (
    <div className="card budget-card">
      <div className="card-header">
        <div>
          <h2>Budget Health</h2>
          <p className="card-subtext">Monthly category progress and remaining balance.</p>
        </div>
      </div>

      <div className="budget-list">
        {data.length === 0 ? (
          <p className="empty-text">No budget data available.</p>
        ) : (
          data.map((item) => (
            <div className="budget-item" key={item.id}>
              <div className="budget-row">
                <span className="budget-label">{item.category}</span>
                <span className="budget-amount">
                  {formatCurrency(item.spent)} / {formatCurrency(item.monthly_limit)}
                </span>
              </div>

              <div className="progress-bar">
                <div
                  className={`progress-fill ${item.color_class || 'fill-blue'}`}
                  style={{ width: `${Math.min(item.progress || 0, 100)}%` }}
                />
              </div>

              <div className="budget-row">
                <span className="muted-text">{Math.round(item.progress || 0)}% used</span>
                <span className={(item.remaining || 0) < 0 ? 'negative' : 'positive'}>
                  {(item.remaining || 0) < 0
                    ? `Over by ${formatCurrency(Math.abs(item.remaining || 0))}`
                    : `Left ${formatCurrency(item.remaining || 0)}`}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default BudgetCard;