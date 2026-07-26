require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // We update all users to admin for testing purposes
    // Or we can just update a specific one. Let's update all.
    const User = require('./src/models/User'); // Assuming User model is here
    
    const result = await User.updateMany({}, { $set: { role: 'admin' } });
    console.log(`Updated ${result.modifiedCount} users to admin role.`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error', err);
    process.exit(1);
  });
