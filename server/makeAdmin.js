import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './src/models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // We update all users to admin for testing purposes
    const result = await User.updateMany({}, { $set: { role: 'admin' } });
    console.log(`Updated ${result.modifiedCount} users to admin role.`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error', err);
    process.exit(1);
  });
