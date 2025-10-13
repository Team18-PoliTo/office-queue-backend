// Service Repository - Abstraction layer for service data access
import { AppDataSource } from "../config/database";
import ServiceDAO from "../daos/ServiceDAO";

interface IServiceRepository {
  findAll(): Promise<ServiceDAO[]>;
}

class ServiceRepository implements IServiceRepository {
  private serviceRepository = AppDataSource.getRepository(ServiceDAO);

  async findAll(): Promise<ServiceDAO[]> {
    return await this.serviceRepository.find();
  }
}

export default ServiceRepository;

