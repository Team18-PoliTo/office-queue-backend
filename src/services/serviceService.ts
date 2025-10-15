// src/services/serviceService.ts
// Service Service – Business logic layer for services
import { ServiceMapper } from "../mappers/ServiceMapper";
import { ServiceDTO } from "../models/dto/ServiceDTO";
import ServiceDAO from "../models/dao/ServiceDAO";
import ServiceRepository from "../repositories/ServiceRepository";

// Interface for dependency injection
interface IServiceRepository {
  findAll(): Promise<ServiceDAO[]>;
}

class ServiceService {
  // By default use real repository, but allow injection for testing or integration
  constructor(private serviceRepository: IServiceRepository = new ServiceRepository()) {}

  async getAllServices(): Promise<ServiceDTO[]> {
    const serviceDAOs = await this.serviceRepository.findAll();
    return ServiceMapper.toDTOList(serviceDAOs);
  }
}

// Export singleton for production use and class for testing/DI
export const serviceService = new ServiceService();
export default ServiceService;

