const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const verifyToken = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', budgetController.getAllBudgets);
router.post('/', budgetController.createBudget);
router.put('/:id', budgetController.updateBudget);
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;