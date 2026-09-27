import app from './src/app.js';
import connectDB from './src/config/db.js';

// Vercel serverless handler
let isConnected = false;

export default async function handler(req, res) {
  // Connect to MongoDB once (connection pooling for serverless)
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }

  return app(req, res);
}
