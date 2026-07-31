import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import ApiError from './utils/ApiError.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

// 1. Security HTTP Headers
app.use(helmet());

// 2. Cross-Origin Resource Sharing
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);

// 3. HTTP Request Logging (dev environment)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// 4. Body Parsing Middlewares
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// 5. Health Check Routes
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Library Management System API is healthy',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Library Management System API v1 is operational',
    timestamp: new Date().toISOString(),
  });
});

// 6. Handle Undefined / 404 Routes
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// 7. Global Error Handler Middleware
app.use(errorHandler);

export default app;
