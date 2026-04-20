import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const COLORS = ['#38bdf8', '#4ade80', '#fbbf24', '#f87171', '#a78bfa', '#2dd4bf'];

function CategoryPieChart({ data = [] }) {
  const chartData = data
    .map((item) => ({
      category: item.category,
      amount: Number(item.amount),
    }))
    .filter((item) => item.amount > 0);

  const total = chartData.reduce((sum, item) => sum + item.amount, 0);
  

  return (
    <div className="card chart-card">
      <div className="card-header">
        <div>
          <h2>Expense Mix</h2>
          <p className="card-subtext">How your expense categories are split.</p>
        </div>
      </div>

      <div className="chart-wrap">
        {total === 0 ? (
          <p className="empty-text">No expense data available for pie chart.</p>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label
                isAnimationActive={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default CategoryPieChart;