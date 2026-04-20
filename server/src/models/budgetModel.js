const db = require('../config/db');

const getAllBudgets = async (userId) => {
  const [rows] = await db.query(
    'SELECT id, category, monthly_limit, color_class, created_at FROM budgets WHERE user_id = ? ORDER BY id DESC',
    [userId]
  );
  return rows;
};

const createBudget = async ({ user_id, category, monthly_limit, color_class }) => {
  const [result] = await db.query(
    `
    INSERT INTO budgets (user_id, category, monthly_limit, color_class)
    VALUES (?, ?, ?, ?)
    `,
    [user_id, category, monthly_limit, color_class]
  );
  return result;
};

const updateBudget = async (id, userId, { category, monthly_limit, color_class }) => {
  const [result] = await db.query(
    `
    UPDATE budgets
    SET category = ?, monthly_limit = ?, color_class = ?
    WHERE id = ? AND user_id = ?
    `,
    [category, monthly_limit, color_class, id, userId]
  );
  return result;
};

const deleteBudget = async (id, userId) => {
  const [result] = await db.query(
    'DELETE FROM budgets WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  return result;
};

module.exports = {
  getAllBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
};