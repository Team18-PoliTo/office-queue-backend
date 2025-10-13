import { TicketRepository } from "../repositories/TicketRepository";
import { ServiceRepository } from "../repositories/ServiceRepository";

class TicketService {
    private ticketRepo = new TicketRepository();
    private serviceRepo = new ServiceRepository();

    /** Creates ticket for selected service and returns plain response (no queue yet). */
    async createForService(serviceId: number) {
        // 1) find service
        const service = await this.serviceRepo.findById(serviceId);
        if (!service) {
            const err: any = new Error("Service not found");
            err.status = 404;
            throw err;
        }

        // 2) create ticket
        const ticket = await this.ticketRepo.create(service.name);

        // 3) return minimal payload (without queue/wait calc)
        return {
            id: ticket.id,
            serviceName: ticket.serviceName,
            timestamp:
                ticket.timestamp instanceof Date
                    ? ticket.timestamp.toISOString()
                    : (ticket as any).timestamp,
            // queue not implemented yet
            waitEstimateMin: null,
        };
    }
}

export const ticketService = new TicketService();

