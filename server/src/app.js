import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import corsOptions from './config/cors.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import errorHandler from './middleware/errorHandler.js';
import logger from './middleware/logger.js';

const app = express();

// ── Security ──────────────────────────────────────
app.use(helmet());
app.use(cors(corsOptions));

// ── Parsing ───────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public', express.static('public')); // Serve static uploads

// ── Logging ───────────────────────────────────────
app.use(logger);

// ── Rate Limiting ─────────────────────────────────
app.use('/api', apiLimiter);

// ── Health Check ──────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🍛 Guly Eats API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ── API Routes ────────────────────────────────────
import authRoutes from './routes/authRoutes.js';
import cityRoutes from './routes/cityRoutes.js';
import placeRoutes from './routes/placeRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import famousPlaceRoutes from './routes/famousPlaceRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import itineraryRoutes from './routes/itineraryRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/famous-places', famousPlaceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/itineraries', itineraryRoutes);
// app.use('/api/wishlist', wishlistRoutes);
// app.use('/api/itineraries', itineraryRoutes);
// app.use('/api/map', mapRoutes);
// app.use('/api/upload', uploadRoutes);
// app.use('/api/search', searchRoutes);
// app.use('/api/recommendations', recommendationRoutes);
// app.use('/api/admin', adminRoutes);

// ── 404 Handler ───────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.url} not found`,
  });
});

// ── Global Error Handler ──────────────────────────
app.use(errorHandler);

export default app;
