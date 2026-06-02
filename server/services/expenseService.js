const prisma = require('../lib/prisma');

const VALID_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'];

async function listExpenses({ category, dateFrom, dateTo, title } = {}) {
  const where = {};

  if (category && VALID_CATEGORIES.includes(category)) {
    where.category = category;
  }
  if (dateFrom || dateTo) {
    where.date = {};
    if (dateFrom) where.date.gte = dateFrom;
    if (dateTo) where.date.lte = dateTo;
  }
  if (title) {
    where.title = { contains: title, mode: 'insensitive' };
  }

  return prisma.expense.findMany({
    where,
    orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
  });
}

async function getExpense(id) {
  const expense = await prisma.expense.findUnique({ where: { id } });
  if (!expense) {
    const err = new Error('Expense not found');
    err.status = 404;
    throw err;
  }
  return expense;
}

async function createExpense({ title, amount, category, date, note }) {
  return prisma.expense.create({
    data: { title: title.trim(), amount: Number(amount), category, date, note: note?.trim() || null },
  });
}

async function updateExpense(id, { title, amount, category, date, note }) {
  await getExpense(id);
  return prisma.expense.update({
    where: { id },
    data: { title: title.trim(), amount: Number(amount), category, date, note: note?.trim() || null },
  });
}

async function deleteExpense(id) {
  await getExpense(id);
  return prisma.expense.delete({ where: { id } });
}

async function getMonthlySummary(month) {
  // month = YYYY-MM
  const [year, mon] = month.split('-');
  const dateFrom = `${year}-${mon}-01`;
  const lastDay = new Date(Number(year), Number(mon), 0).getDate();
  const dateTo = `${year}-${mon}-${String(lastDay).padStart(2, '0')}`;

  const expenses = await prisma.expense.findMany({
    where: { date: { gte: dateFrom, lte: dateTo } },
  });

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const count = expenses.length;

  const byCategory = {};
  for (const e of expenses) {
    byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
  }

  const breakdown = Object.entries(byCategory)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  return { month, total, count, breakdown };
}

module.exports = { listExpenses, getExpense, createExpense, updateExpense, deleteExpense, getMonthlySummary };
