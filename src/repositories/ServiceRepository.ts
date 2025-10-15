// Service Repository - Abstraction layer for service data access
import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import ServiceDAO from "../models/dao/ServiceDAO";

interface IServiceRepository {
  findAll(): Promise<ServiceDAO[]>;
}

export class ServiceRepository implements IServiceRepository {
  constructor(
      private readonly repo: Repository<ServiceDAO> =
      AppDataSource.getRepository(ServiceDAO)
  ) {}

  async findAll(): Promise<ServiceDAO[]> {
    return await this.repo.find();
  }

  async findById(id: number): Promise<ServiceDAO | null> {
    return await this.repo.findOne({ where: { id } });
  }
}

export default ServiceRepository;

