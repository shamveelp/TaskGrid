import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://taskgrid.shamveelp.xyz',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: Origin "${origin}" is not allowed`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json());

// Mount all routes under /api
app.use('/api', routes);

export default app;
