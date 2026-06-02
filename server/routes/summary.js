const { Router } = require('express');
const ctrl = require('../controllers/expenseController');

const router = Router();
router.get('/monthly', ctrl.monthlySummary);

module.exports = router;
