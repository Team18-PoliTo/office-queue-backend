import { Router } from 'express';
import ServiceController from '../controllers/serviceController';
import ServiceService from '../services/serviceService';
import ServiceRepository from '../repositories/ServiceRepository';
import { requireCustomer } from '../middleware/authMiddleware';

const router = Router();

// Dependency Injection Setup
const serviceRepository = new ServiceRepository();
const serviceService = new ServiceService(serviceRepository);
const serviceController = new ServiceController(serviceService);

// GET /services - Get all services (customer only)
router.get('/', requireCustomer, serviceController.getAllServices.bind(serviceController));

export default router;
