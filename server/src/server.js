import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import designRoutes from './routes/designRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: true, legacyHeaders: false }));
app.use('/api/uploads', express.static('server/src/uploads', { maxAge: '1h' }));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'threadforge-api' }));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/banners', bannerRoutes);

app.use(notFound);
app.use(errorHandler);

async function start() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required. Add it to .env.');
  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(port, () => console.log(`ThreadForge API running at http://localhost:${port}`));
}

if (process.env.NODE_ENV !== 'test') {
  start().catch(error => {
    console.error(error.message);
    process.exit(1);
  });
}

export default app;
