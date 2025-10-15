// Counter Repository - Abstraction layer for counter data access
import { AppDataSource } from "../config/database";
import CounterDAO from "../models/dao/CounterDAO";

interface ICounterRepository {
  // TODO: Define repository interface
  findById(id:Number):Promise<CounterDAO | null> 
}

class CounterRepository implements ICounterRepository {
  private serviceRepository = AppDataSource.getRepository(CounterDAO);

  async findById(id: number): Promise<CounterDAO | null> {
    const counter = await this.serviceRepository.findOne({ where: { id } });
    
    return counter || null;
  }
}

export default CounterRepository;
