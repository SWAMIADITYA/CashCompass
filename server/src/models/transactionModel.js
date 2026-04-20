const pool = require('../config/db');

const getAllTransactions = async () => {
  const [rows] = await pool.query(`
    SELECT 
      id,
      title,
      amount,
      category,
      type,
      transaction_date,
      notes,
      status,
      created_at,
      updated_at
    FROM transactions
    ORDER BY transaction_date DESC, id DESC
  `);

  return rows;
};

const getTransactionById = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT 
      id,
      title,
      amount,
      category,
      type,
      transaction_date,
      notes,
      status,
      created_at,
      updated_at
    FROM transactions
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0];
};

const createTransaction = async (transactionData) => {
  const { title, amount, category, type, transaction_date, notes, status } = transactionData;

  const [result] = await pool.query(
    `
    INSERT INTO transactions
    (title, amount, category, type, transaction_date, notes, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [title, amount, category, type, transaction_date, notes || null, status || 'completed']
  );

  return getTransactionById(result.insertId);
};

const updateTransaction = async (id, transactionData) => {
  const { title, amount, category, type, transaction_date, notes, status } = transactionData;

  const [result] = await pool.query(
    `
    UPDATE transactions
    SET
      title = ?,
      amount = ?,
      category = ?,
      type = ?,
      transaction_date = ?,
      notes = ?,
      status = ?
    WHERE id = ?
    `,
    [title, amount, category, type, transaction_date, notes || null, status || 'completed', id]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return getTransactionById(id);
};

const deleteTransaction = async (id) => {
  const [result] = await pool.query(
    `
    DELETE FROM transactions
    WHERE id = ?
    `,
    [id]
  );

  return result.affectedRows > 0;
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};