import { ServiceRepository} from "../repositories/ServiceRepository";
import { queueService } from "./queueService";
import { NotFoundError } from "../models/errors/NotFoundError";
import { TicketDTO } from "../models/dto/TicketDTO";

interface IQueueService {
    create(serviceName: string): { id: number; serviceName: string; timestamp: Date };
}

class TicketService {
    constructor(
        private serviceRepo: ServiceRepository = new ServiceRepository(),
        private q: IQueueService = queueService
    ) {}

    async createForService(serviceId: number): Promise<TicketDTO> {
        const service = await this.serviceRepo.findById(serviceId);
        if (!service) throw new NotFoundError("Service not found");

        const t = this.q.create(service.name);
        return {
            id: t.id,
            serviceName: t.serviceName,
            timestamp: t.timestamp.toISOString()
        };
    }
}

export const ticketService = new TicketService();
export default TicketService;



