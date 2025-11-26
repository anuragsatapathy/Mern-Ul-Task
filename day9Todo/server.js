require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./api/src/config/db');
const listRouter = require('./api/src/api/list/list.router');
const taskRouter = require('./api/src/api/task/task.router');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/lists', listRouter);
app.use('/api/tasks', taskRouter);

app.get('/', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

