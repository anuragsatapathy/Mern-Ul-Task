const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./src/config/db');
const apiRouter = require('./src/api/api.router');
const { errorHandler } = require('./src/middlewares/error.middleware');
const { requestLogger } = require('./src/middlewares/logging.middleware');

const app = express();
app.use(express.json());

// Logging
app.use(requestLogger);

// All API routes
app.use('/api', apiRouter);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    )
  )
  .catch((err) => {
    console.error('DB connection failed', err);
    process.exit(1);
  });

