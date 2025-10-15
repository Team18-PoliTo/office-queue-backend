// Counter Repository - Abstraction layer for counter data access
import { AppDataSource } from "../config/database";
import CounterDAO from "../models/dao/CounterDAO";

interface ICounterRepository {
  findById(id: Number): Promise<CounterDAO | null>;
}

class CounterRepository implements ICounterRepository {
  private counterRepository = AppDataSource.getRepository(CounterDAO);

  async findById(id: number): Promise<CounterDAO | null> {
    const counter = await this.counterRepository.findOne({ where: { id } });

    return counter || null;
  }
}

export default CounterRepository;
