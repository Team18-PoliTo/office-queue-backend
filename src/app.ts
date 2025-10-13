import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import serviceRoutes from './routes/serviceRoutes';
import ticketRoutes from "./routes/ticketRoutes";

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Office Queue Management API is running' });
});

// Routes
app.use('/api/services', serviceRoutes);
app.use('/api/tickets', ticketRoutes);

export default app;
