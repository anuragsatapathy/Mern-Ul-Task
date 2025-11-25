require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const apiRouter = require('./src/api/api.router');
const { connectDB } = require('./src/config/db');

const app = express();
app.use(cors());
app.use(express.json());

// connect db
connectDB();

// routes
app.use('/api', apiRouter);

// health
app.get('/', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
