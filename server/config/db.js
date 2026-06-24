const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.error('MONGO_URI is missing in environment variables');
      return;
    }

    if (mongoUri.includes('<db_password>')) {
      throw new Error('MONGO_URI contains placeholder <db_password>. Update server/.env with your real Atlas password.');
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
  }
};

module.exports = connectDB;

