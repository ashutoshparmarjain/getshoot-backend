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

const allowedOrigins: string[] = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map(x => x.trim())
  : [];

// Define the custom CORS options object
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Log the incoming origin and the expected origins for debugging
    console.log("CORS Check: Incoming origin:", origin);
    console.log("CORS Check: Allowed origins:", allowedOrigins);
    
    // 1. Allow non-browser requests (like curl)
    if (!origin) return callback(null, true);
    
    // 2. Check if the incoming origin is in the allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // 3. Block and log the failure
    console.error(`CORS Blocked: Origin ${origin} is not allowed.`);
    // Passing false as the second argument indicates the origin should not be allowed
    return callback(new Error("Not allowed by CORS"), false); 
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Crucial for allowing cookies/Auth headers
  optionsSuccessStatus: 200
};

// Apply the custom CORS configuration to all incoming requests
app.use(cors(corsOptions));

// Explicitly handle all OPTIONS (preflight) requests using the SAME configuration
app.options("*", cors(corsOptions)); 

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
