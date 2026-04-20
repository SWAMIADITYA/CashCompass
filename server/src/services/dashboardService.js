const pool = require('../config/db');

const getSummaryData = async (userId) => {
  const [rows] = await pool.query(`
    SELECT
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS totalIncome,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS totalExpense,
      COALESCE(
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) -
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END),
        0
      ) AS balance,
      COUNT(*) AS totalTransactions
    FROM transactions
    WHERE user_id = ?
  `, [userId]);

  return rows[0];
};

const getMonthlyChartData = async (userId) => {
  const [rows] = await pool.query(`
    SELECT
      DATE_FORMAT(transaction_date, '%b') AS month,
      YEAR(transaction_date) AS yearNumber,
      MONTH(transaction_date) AS monthNumber,
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense
    FROM transactions
    WHERE user_id = ?
    GROUP BY YEAR(transaction_date), MONTH(transaction_date), DATE_FORMAT(transaction_date, '%b')
    ORDER BY yearNumber ASC, monthNumber ASC
  `, [userId]);

  return rows;
};

const getCategoryBreakdown = async (userId) => {
  const [rows] = await pool.query(`
    SELECT
      category,
      COALESCE(SUM(amount), 0) AS amount
    FROM transactions
    WHERE user_id = ? AND type = 'expense'
    GROUP BY category
    ORDER BY amount DESC
  `, [userId]);

  return rows;
};

const getBudgetVsActual = async (userId) => {
  const [rows] = await pool.query(`
    SELECT
      b.id,
      b.category,
      b.monthly_limit,
      b.color_class,
      COALESCE(SUM(t.amount), 0) AS spent,
      (b.monthly_limit - COALESCE(SUM(t.amount), 0)) AS remaining
    FROM budgets b
    LEFT JOIN transactions t
      ON b.category = t.category
      AND t.user_id = b.user_id
      AND t.type = 'expense'
      AND YEAR(t.transaction_date) = YEAR(CURDATE())
      AND MONTH(t.transaction_date) = MONTH(CURDATE())
    WHERE b.user_id = ?
    GROUP BY b.id, b.category, b.monthly_limit, b.color_class
    ORDER BY b.category ASC
  `, [userId]);

  return rows.map((row) => ({
    ...row,
    progress: row.monthly_limit > 0
      ? Math.min((row.spent / row.monthly_limit) * 100, 100)
      : 0,
  }));
};

module.exports = {
  getSummaryData,
  getMonthlyChartData,
  getCategoryBreakdown,
  getBudgetVsActual,
};