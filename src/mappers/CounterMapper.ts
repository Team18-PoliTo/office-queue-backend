import CounterDAO from "../models/dao/CounterDAO";
import { CounterDTO } from "../models/dto/CounterDTO";
import { ServiceMapper } from "./ServiceMapper";

export class CounterMapper {
  static toDTO(counterDAO: CounterDAO): CounterDTO {
    return {
      id: counterDAO.id,
      name: counterDAO.name,
      services: counterDAO.services
        ? ServiceMapper.toDTOList(counterDAO.services)
        : [],
    } as CounterDTO;
  }

  static toDTOList(counterDAOs: CounterDAO[]): CounterDTO[] {
    return counterDAOs.map((counter) => this.toDTO(counter));
  }
}

export default CounterMapper;
