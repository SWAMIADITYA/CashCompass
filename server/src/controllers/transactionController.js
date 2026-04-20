const db = require('../config/db');

exports.getAllTransactions = async (req, res) => {
  try {
    const { search, type, category, startDate, endDate } = req.query;
    const userId = req.user.id;

    let query = `
      SELECT 
        id,
        title,
        amount,
        category,
        type,
        transaction_date,
        notes,
        status,
        created_at
      FROM transactions
    `;

    const conditions = ['user_id = ?'];
    const values = [userId];

    if (search) {
      conditions.push('(title LIKE ? OR notes LIKE ?)');
      values.push(`%${search}%`, `%${search}%`);
    }

    if (type) {
      conditions.push('type = ?');
      values.push(type);
    }

    if (category) {
      conditions.push('category = ?');
      values.push(category);
    }

    if (startDate) {
      conditions.push('transaction_date >= ?');
      values.push(startDate);
    }

    if (endDate) {
      conditions.push('transaction_date <= ?');
      values.push(endDate);
    }

    query += ` WHERE ${conditions.join(' AND ')}`;
    query += ' ORDER BY transaction_date DESC, id DESC';

    const [rows] = await db.query(query, values);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const { title, amount, category, type, transaction_date, notes, status } = req.body;
    const userId = req.user.id;

    const query = `
      INSERT INTO transactions (user_id, title, amount, category, type, transaction_date, notes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      userId,
      title,
      amount,
      category,
      type,
      transaction_date,
      notes || '',
      status || 'completed',
    ]);

    res.status(201).json({
      message: 'Transaction created successfully',
      id: result.insertId,
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Failed to create transaction' });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category, type, transaction_date, notes, status } = req.body;
    const userId = req.user.id;

    const query = `
      UPDATE transactions
      SET title = ?, amount = ?, category = ?, type = ?, transaction_date = ?, notes = ?, status = ?
      WHERE id = ? AND user_id = ?
    `;

    await db.query(query, [
      title,
      amount,
      category,
      type,
      transaction_date,
      notes || '',
      status || 'completed',
      id,
      userId,
    ]);

    res.status(200).json({ message: 'Transaction updated successfully' });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ message: 'Failed to update transaction' });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await db.query('DELETE FROM transactions WHERE id = ? AND user_id = ?', [id, userId]);

    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Failed to delete transaction' });
  }
};