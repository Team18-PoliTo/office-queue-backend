// Service Service - Business logic layer for services
import { ServiceMapper } from "../mappers/ServiceMapper";
import { ServiceDTO } from "../models/dto/ServiceDTO";
import ServiceDAO from "../models/dao/ServiceDAO";

// Interface for dependency injection
interface IServiceRepository {
  findAll(): Promise<ServiceDAO[]>;
}

class ServiceService {
  constructor(private serviceRepository: IServiceRepository) {}

  async getAllServices(): Promise<ServiceDTO[]> {
    const serviceDAOs = await this.serviceRepository.findAll();
    return ServiceMapper.toDTOList(serviceDAOs);
  }
}

export default ServiceService;
