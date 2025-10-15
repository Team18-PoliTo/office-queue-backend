import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import serviceRoutes from './routes/serviceRoutes';
import ticketRoutes from "./routes/ticketRoutes";
import { validateUserType } from './middleware/authMiddleware';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (no auth required)
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Office Queue Management API is running' });
});

// Apply auth middleware to all /api routes (except health)
app.use('/api', validateUserType);

// Routes
app.use('/api/services', serviceRoutes);
app.use('/api/tickets', ticketRoutes);


//This must always be the last middleware added
app.use(errorHandler);

export default app;
