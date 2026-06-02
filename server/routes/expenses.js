const { Router } = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/expenseController');
const validate = require('../middleware/validate');

const router = Router();

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'];

const expenseRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
  body('category').isIn(CATEGORIES).withMessage(`Category must be one of: ${CATEGORIES.join(', ')}`),
  body('date').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be YYYY-MM-DD'),
  body('note').optional({ nullable: true }).isString(),
];

router.get('/', ctrl.index);
router.get('/:id', ctrl.show);
router.post('/', expenseRules, validate, ctrl.create);
router.put('/:id', expenseRules, validate, ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
