import app from './app.js';
import connectDB from './config/db.js';
import env from './config/env.js';

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  // Start Express server
  const server = app.listen(env.PORT, () => {
    console.log('');
    console.log('🍛 ════════════════════════════════════════');
    console.log('   GULY EATS API SERVER');
    console.log('════════════════════════════════════════════');
    console.log(`   🌍 Environment : ${env.NODE_ENV}`);
    console.log(`   🚀 Server      : http://localhost:${env.PORT}`);
    console.log(`   💚 Health      : http://localhost:${env.PORT}/api/health`);
    console.log(`   🎨 Frontend    : ${env.FRONTEND_URL}`);
    console.log('════════════════════════════════════════════');
    console.log('');
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer();