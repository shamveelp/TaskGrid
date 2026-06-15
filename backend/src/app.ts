import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './routes';
import { logger } from './utils/logger';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://taskgrid.shamveelp.xyz',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      logger.warn('CORS', `Blocked request from disallowed origin: ${origin}`);
      callback(new Error(`CORS: Origin "${origin}" is not allowed`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json());

// HTTP request logger middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info('HTTP', `${req.method} ${req.originalUrl}`);
  next();
});

// Mount all routes under /api
app.use('/api', routes);

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('App', err.message, { stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
