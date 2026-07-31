import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import ApiError from './utils/ApiError.js';
import errorHandler from './middlewares/errorHandler.js';
import bookRoutes from './routes/bookRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import borrowingRoutes from './routes/borrowingRoutes.js';

const app = express();

// 1. Security HTTP Headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

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

// 5. Health Check Endpoints
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

// 6. Interactive API Documentation (Swagger UI)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/docs', (req, res) => res.redirect('/api-docs'));

// 7. Application Resource Routes
app.use('/api/v1/books', bookRoutes);
app.use('/api/v1/members', memberRoutes);
app.use('/api/v1/borrowings', borrowingRoutes);

// 8. 404 Fallback Handler for Undefined Endpoints
app.use('*', (req, res, next) => {
  next(new ApiError(404, `Cannot find route '${req.originalUrl}' on this server`));
});

// 9. Centralized Global Error Handler Middleware
app.use(errorHandler);

export default app;
