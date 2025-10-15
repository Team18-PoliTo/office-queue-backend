import { Request, Response, NextFunction } from "express";
import { ServiceDTO } from "../models/dto/ServiceDTO";
import { ServiceDTOMapper } from "../mappers/ServiceDTOMapper";
import { ServiceResponseDTO } from "../models/dto/ServiceResponseDTO";

interface IServiceService {
  getAllServices(): Promise<ServiceDTO[]>;
}

class ServiceController {
  constructor(private serviceService: IServiceService) {}

  async getAllServices(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const services = await this.serviceService.getAllServices();
      const response: ServiceResponseDTO[] = ServiceDTOMapper.toResponseList(services);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default ServiceController;

