import { Router } from 'express';
import CounterRepository from '../repositories/CounterRepository';
import CounterService from '../services/counterService';
import CounterController from '../controllers/counterController';
import { requireOfficer } from '../middleware/authMiddleware';

const router = Router();

// Dependency Injection Setup
const counterRepository = new CounterRepository();
const counterService = new CounterService(counterRepository);
const counterController = new CounterController(counterService);

// GET /counter/:id - Get counter by ID (officer only)
router.get('/:id', requireOfficer, counterController.getCounterById.bind(counterController));

// GET /counter/:id/next - Call next customer (officer only)
router.get('/:id/next', requireOfficer, counterController.getNextCustomer.bind(counterController));

export default router;
