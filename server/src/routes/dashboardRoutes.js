const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const verifyToken = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/summary', dashboardController.getSummary);
router.get('/monthly', dashboardController.getMonthlyData);
router.get('/categories', dashboardController.getCategoryData);
router.get('/budget-vs-actual', dashboardController.getBudgetComparison);

module.exports = router;