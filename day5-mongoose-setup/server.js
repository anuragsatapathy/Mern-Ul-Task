require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const app = express();
app.use(cors());
app.use(express.json());

// User routes
const userRoutes = require('./src/api/user.routes');
app.use('/api/users', userRoutes);

// Profile routes
const profileRoutes = require('./src/api/profile.routes');
app.use('/api/profiles', profileRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Start server after DB connection
const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
})();

