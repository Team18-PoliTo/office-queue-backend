// Service Service - Business logic layer for services
import { ServiceMapper } from "../mappers/ServiceMapper";
import { ServiceDTO } from "../dtos/ServiceDTO";
import ServiceDAO from "../daos/ServiceDAO";

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
