
import { queueService } from "../services/queueService";
import { ServiceRepository } from "../repositories/ServiceRepository";
import { NotFoundError } from "../models/errors/NotFoundError";

export type TicketDTO = {
    id: number;
    serviceName: string;
    timestamp: string;          // ISO-строка
    waitEstimateMin: number | null;
};

class TicketService {
    private serviceRepo = new ServiceRepository();

    async createForService(serviceId: number): Promise<TicketDTO> {
        const service = await this.serviceRepo.findById(serviceId);
        if (!service) {
            const err: any = new NotFoundError("Service not found");
            throw err;
        }

        const t = queueService.create(service.name);

        return {
            id: t.id,
            serviceName: t.serviceName,
            timestamp: t.timestamp.toISOString(),
            waitEstimateMin: null, // заполни позже своей логикой ожидания
        };
    }
}

export const ticketService = new TicketService();
export default TicketService;


