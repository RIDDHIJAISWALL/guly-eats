import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './src/models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Demote everyone to user
    await User.updateMany({}, { $set: { role: 'user' } });
    console.log('Demoted all users to regular user role.');

    // Promote the super admin
    const email = 'riddhijaiswal1406@gmail.com';
    const user = await User.findOne({ email });
    if (user) {
      user.role = 'admin';
      await user.save();
      console.log(`Promoted ${email} to admin.`);
    } else {
      console.log(`User ${email} not found.`);
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error', err);
    process.exit(1);
  });
