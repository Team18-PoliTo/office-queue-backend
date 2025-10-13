import { Request, Response, NextFunction } from 'express';
import { ServiceDTO } from '../dtos/ServiceDTO';

// Interface for dependency injection
interface IServiceService {
  getAllServices(): Promise<ServiceDTO[]>;
}

// Service Controller
class ServiceController {
  constructor(private serviceService: IServiceService) {}

  async getAllServices(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const services = await this.serviceService.getAllServices();
      res.json(services);
    } catch (error) {
      next(error);
    }
  }
}

export default ServiceController;
