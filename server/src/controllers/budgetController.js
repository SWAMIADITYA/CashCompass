// const budgetModel = require('../models/budgetModel');

// const getAllBudgets = async (req, res) => {
//   try {
//     const budgets = await budgetModel.getAllBudgets(req.user.id);
//     res.status(200).json(budgets);
//   } catch (error) {
//     console.error('Error fetching budgets:', error);
//     res.status(500).json({ message: 'Failed to fetch budgets' });
//   }
// };

// // const createBudget = async (req, res) => {
// //   try {
// //     const { category, monthly_limit, color_class } = req.body;
// //     const user_id = req.user.id;

// //     const result = await budgetModel.createBudget({
// //       user_id,
// //       category,
// //       monthly_limit,
// //       color_class: color_class || 'fill-blue',
// //     });

// //     res.status(201).json({
// //       message: 'Budget created successfully',
// //       id: result.insertId,
// //     });
// //   } catch (error) {
// //     console.error('Error creating budget:', error);
// //     res.status(500).json({ message: 'Failed to create budget' });
// //   }
// // };


// const createBudget = async (req, res) => {
//   try {
//     const { category, monthly_limit, color_class } = req.body;
//     const user_id = req.user.id;

//     const result = await budgetModel.createBudget({
//       user_id,
//       category,
//       monthly_limit,
//       color_class: color_class || 'fill-blue',
//     });

//     res.status(201).json({
//       message: 'Budget created successfully',
//       id: result.insertId,
//     });
//   } catch (error) {
//     console.error('Error creating budget:', error);

//     if (error.code === 'ER_DUP_ENTRY') {
//       return res.status(409).json({
//         message: 'Budget for this category already exists',
//       });
//     }

//     res.status(500).json({ message: 'Failed to create budget' });
//   }
// };



// // const updateBudget = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { category, monthly_limit, color_class } = req.body;

// //     await budgetModel.updateBudget(id, req.user.id, {
// //       category,
// //       monthly_limit,
// //       color_class: color_class || 'fill-blue',
// //     });

// //     res.status(200).json({ message: 'Budget updated successfully' });
// //   } catch (error) {
// //     console.error('Error updating budget:', error);
// //     res.status(500).json({ message: 'Failed to update budget' });
// //   }
// // };


// const updateBudget = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { category, monthly_limit, color_class } = req.body;

//     await budgetModel.updateBudget(id, req.user.id, {
//       category,
//       monthly_limit,
//       color_class: color_class || 'fill-blue',
//     });

//     res.status(200).json({ message: 'Budget updated successfully' });
//   } catch (error) {
//     console.error('Error updating budget:', error);

//     if (error.code === 'ER_DUP_ENTRY') {
//       return res.status(409).json({
//         message: 'Budget for this category already exists',
//       });
//     }

//     res.status(500).json({ message: 'Failed to update budget' });
//   }
// };

// const deleteBudget = async (req, res) => {
//   try {
//     const { id } = req.params;

//     await budgetModel.deleteBudget(id, req.user.id);

//     res.status(200).json({ message: 'Budget deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting budget:', error);
//     res.status(500).json({ message: 'Failed to delete budget' });
//   }
// };

// module.exports = {
//   getAllBudgets,
//   createBudget,
//   updateBudget,
//   deleteBudget,
// };





// -------------------------------------------



const budgetModel = require('../models/budgetModel');

const getAllBudgets = async (req, res) => {
  try {
    const budgets = await budgetModel.getAllBudgets(req.user.id);
    res.status(200).json(budgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    res.status(500).json({ message: 'Failed to fetch budgets' });
  }
};

const createBudget = async (req, res) => {
  try {
    const { category, monthly_limit, color_class } = req.body;
    const user_id = req.user.id;

    const result = await budgetModel.createBudget({
      user_id,
      category,
      monthly_limit,
      color_class: color_class || 'fill-blue',
    });

    res.status(201).json({
      message: 'Budget created successfully',
      id: result.insertId,
    });
  } catch (error) {
    console.error('Error creating budget:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        message: 'Budget for this category already exists',
      });
    }

    res.status(500).json({ message: 'Failed to create budget' });
  }
};

const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, monthly_limit, color_class } = req.body;

    await budgetModel.updateBudget(id, req.user.id, {
      category,
      monthly_limit,
      color_class: color_class || 'fill-blue',
    });

    res.status(200).json({ message: 'Budget updated successfully' });
  } catch (error) {
    console.error('Error updating budget:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        message: 'Budget for this category already exists',
      });
    }

    res.status(500).json({ message: 'Failed to update budget' });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;

    await budgetModel.deleteBudget(id, req.user.id);

    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget:', error);
    res.status(500).json({ message: 'Failed to delete budget' });
  }
};

module.exports = {
  getAllBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
};