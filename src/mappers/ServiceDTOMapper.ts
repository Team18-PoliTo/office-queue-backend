import { ServiceDTO } from "../models/dto/ServiceDTO";
import { ServiceResponseDTO } from "../models/dto/ServiceResponseDTO";

export class ServiceDTOMapper {
    static toResponse(dto: ServiceDTO): ServiceResponseDTO {
        const { id, name } = dto;
        return { id, name };
    }

    static toResponseList(list: ServiceDTO[]): ServiceResponseDTO[] {
        return list.map(ServiceDTOMapper.toResponse);
    }
}
