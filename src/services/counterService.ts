// Counter Service - Business logic
import CounterRepository from "../repositories/CounterRepository";
import CounterMapper from "../mappers/CounterMapper";
import { CounterDTO } from "../models/dto/CounterDTO";

interface ICounterService {
  getCounterFromId(id: number): Promise<CounterDTO | null>;
}

class CounterService implements ICounterService {
  constructor(
    private counterRepository: CounterRepository = new CounterRepository()
  ) {}

  async getCounterFromId(id: number): Promise<CounterDTO | null> {
    const counterDAO = await this.counterRepository.findById(id);
    if (!counterDAO) return null;
    return CounterMapper.toDTO(counterDAO);
  }
}

export default CounterService;
