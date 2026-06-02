const svc = require('../services/expenseService');

async function index(req, res, next) {
  try {
    const { category, dateFrom, dateTo, title } = req.query;
    const expenses = await svc.listExpenses({ category, dateFrom, dateTo, title });
    res.json(expenses);
  } catch (e) { next(e); }
}

async function show(req, res, next) {
  try {
    res.json(await svc.getExpense(req.params.id));
  } catch (e) { next(e); }
}

async function create(req, res, next) {
  try {
    const expense = await svc.createExpense(req.body);
    res.status(201).json(expense);
  } catch (e) { next(e); }
}

async function update(req, res, next) {
  try {
    res.json(await svc.updateExpense(req.params.id, req.body));
  } catch (e) { next(e); }
}

async function remove(req, res, next) {
  try {
    await svc.deleteExpense(req.params.id);
    res.json({ success: true });
  } catch (e) { next(e); }
}

async function monthlySummary(req, res, next) {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7);
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ error: 'month must be YYYY-MM' });
    }
    res.json(await svc.getMonthlySummary(month));
  } catch (e) { next(e); }
}

module.exports = { index, show, create, update, remove, monthlySummary };
