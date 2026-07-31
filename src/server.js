import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 5000;

// Catch Uncaught Exceptions synchronously
process.on('uncaughtException', (err) => {
  console.error('[CRITICAL] Uncaught Exception:', err.message);
  console.error(err.stack);
  process.exit(1);
});

// Initialize database connection & launch HTTP server
const startServer = async () => {
  try {
    // 1. Establish Database Connection
    await connectDB();

    // 2. Start Express HTTP Server
    const server = app.listen(PORT, () => {
      console.log(
        `[Server] Library Management API running on http://localhost:${PORT} [${process.env.NODE_ENV || 'development'}]`
      );
    });

    // Gracefully handle Unhandled Promise Rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('[CRITICAL] Unhandled Rejection at:', promise, 'reason:', reason);
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (error) {
    console.error('[Server Error] Server initialization failed:', error.message);
    process.exit(1);
  }
};

startServer();
