import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import pushRouter from "./routes/push.js";


import menuRoutes from './routes/menu.routes.js';
import partyRoutes from './routes/party.routes.js';
import orderRoutes from './routes/order.routes.js';
import requestRoutes from './routes/request.routes.js';
import restaurantRoutes from './routes/restaurant.routes.js';

const app = express();
app.use(express.json());

app.use(helmet());
const allowedOrigins = [
    'http://localhost:3000',
    'http://192.168.0.161:3000',
    'https://ordora-fe.onrender.com',
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Requests without an Origin header include health checks and local tools.
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
    credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    service: 'tablewise-api',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/v1/menu', menuRoutes);
app.use('/api/v1/parties', partyRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/requests', requestRoutes);
app.use('/api/v1/restaurant', restaurantRoutes);
app.use("/api/v1/push", pushRouter);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { message: 'Endpoint not found' }
  });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.status && err.status < 500
        ? err.message
        : 'Internal server error'
    }
  });
});

export default app;