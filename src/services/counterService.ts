// Counter Service - Business logic
import ICounterRepository from "../repositories/CounterRepository";
import CounterMapper from "../mappers/CounterMapper";
import { CounterDTO } from "../models/dto/CounterDTO";

class CounterService {
  constructor(private counterRepository: ICounterRepository) {}

  async getCounterById(id: number): Promise<CounterDTO | null> {
    const counterDAO = await this.counterRepository.findById(id);
    if (!counterDAO) return null;
    return CounterMapper.toDTO(counterDAO);
  }
}

export default CounterService;
