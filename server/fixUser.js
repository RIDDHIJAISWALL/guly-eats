import dotenv from 'dotenv';
import mongoose from 'mongoose';
import * as argon2 from 'argon2';
import User from './src/models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const email = 'riddhijaiswal1406@gmail.com';
    const rawPassword = 'Riddhi@9892';
    const hashedPassword = await argon2.hash(rawPassword);

    const user = await User.findOne({ email });
    if (user) {
      user.password = hashedPassword;
      await user.save();
      console.log(`Password reset for ${email}`);
    } else {
      await User.create({
        name: 'Riddhi Jaiswal',
        email,
        password: hashedPassword,
        role: 'admin'
      });
      console.log(`Created new user ${email}`);
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error', err);
    process.exit(1);
  });
