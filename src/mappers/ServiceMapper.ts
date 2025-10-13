import ServiceDAO from "../daos/ServiceDAO";
import { ServiceDTO } from "../dtos/ServiceDTO";

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
