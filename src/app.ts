import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { errorHandler } from './utils/errorHandler';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';

dotenv.config();

const app = express();

const allowedOrigins: string[] = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map(x => x.trim())
  : [];

app.use(cors({
  origin: (origin, callback) => {
    console.log("***************");
    console.log("origin", origin)
    console.log("allowedO", allowedOrigins)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

app.options("*", cors());

app.use(express.json());
app.use(morgan('dev'));


console.log(process.env)
console.log(process.env.CORS_ORIGINS)
console.log("********************")



app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', productRoutes);

app.use(errorHandler);

export default app;

