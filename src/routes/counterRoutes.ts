import { Router } from 'express';
import CounterRepository from '../repositories/CounterRepository';
import CounterService from '../services/counterService';
import CounterController from '../controllers/counterController';

const router = Router();

// Dependency Injection Setup
const counterRepository = new CounterRepository();
const counterService = new CounterService(counterRepository);
const counterController = new CounterController(counterService);

// GET /services - Get all services
router.get('/:id', counterController.getCounterById.bind(counterController));
router.get('/:id/next', counterController.getNextCustomer.bind(counterController));


export default router;
