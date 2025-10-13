import ServiceDAO from "../models/dao/ServiceDAO";
import { ServiceDTO } from "../models/dto/ServiceDTO";

export class ServiceMapper {
  static toDTO(serviceDAO: ServiceDAO): ServiceDTO {
    return {
      id: serviceDAO.id,
      name: serviceDAO.name,
      avg_process_time: serviceDAO.avg_process_time
    };
  }

  static toDTOList(serviceDAOs: ServiceDAO[]): ServiceDTO[] {
    return serviceDAOs.map(service => this.toDTO(service));
  }
}
