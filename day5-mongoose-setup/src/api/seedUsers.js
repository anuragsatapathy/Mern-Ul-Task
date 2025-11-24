require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/user.model');

const run = async () => {
  try {
    await connectDB();

    const users = [
      {
        name: 'Anurag Satapathy',
        email: `anurag${Date.now()}@example.com`,
        password: 'password123',
        phoneNumber: '9876543210',
        isActive: true,
      },
      {
        name: 'Demo User',
        email: `demo${Date.now()}@example.com`,
        password: 'demo1234',
        phoneNumber: '9999999999',
        isActive: true,
      },
    ];

    const inserted = await User.insertMany(users);
    console.log('Inserted users:', inserted);

    process.exit(0);
  } catch (err) {
    console.error('Error inserting users:', err);
    process.exit(1);
  }
};

run();

