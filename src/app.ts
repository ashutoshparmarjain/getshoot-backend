import express from 'express';
import dotenv from 'dotenv';
import cors, { CorsOptions } from 'cors';
import morgan from 'morgan';
import { errorHandler } from './utils/errorHandler';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';

dotenv.config();

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));


app.use(express.json());
app.use(morgan('dev'));

// Only log the specific variable needed, not the entire environment
console.log("********************");
console.log(`CORS_ORIGINS env: ${process.env.CORS_ORIGINS}`);
console.log("********************");


app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', productRoutes);

app.use(errorHandler);

export default app;
