require('dotenv').config();
const express = require('express');
const cors = require('cors');
const expensesRouter = require('./routes/expenses');
const summaryRouter = require('./routes/summary');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));
app.use('/api/expenses', expensesRouter);
app.use('/api/summary', summaryRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
