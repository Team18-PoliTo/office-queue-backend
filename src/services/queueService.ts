import ServiceDAO from '../models/dao/ServiceDAO';

export type Ticket = {
    id: number;
    serviceName: string;
    timestamp: Date;
};

class QueueService {
    private seq = 1;
    private queues = new Map<string, Ticket[]>();

    create(serviceName: string): Ticket {
        const t: Ticket = { id: this.seq++, serviceName, timestamp: new Date() };
        const q = this.queues.get(serviceName) ?? [];
        q.push(t);
        this.queues.set(serviceName, q);
        return t;
    }

    /**
     * Get next ticket from longest queue, or from service with lowest average service time if equal length
     */
    getNextTicket(availableServices: ServiceDAO[]): Ticket | null {
        if (availableServices.length === 0) {
            return null;
        }

        // Filter services that have tickets waiting
        const servicesWithTickets = availableServices.filter(service => 
            this.size(service.name) > 0
        );

        if (servicesWithTickets.length === 0) {
            return null;
        }

        // Sort by queue length (descending), then by average service time (ascending)
        servicesWithTickets.sort((a, b) => {
            const lengthA = this.size(a.name);
            const lengthB = this.size(b.name);
            
            if (lengthA !== lengthB) {
                return lengthB - lengthA; // Longer queue first
            }
            
            return a.avg_process_time - b.avg_process_time; // Lower service time first
        });

        // Get the first ticket from the selected service
        const selectedService = servicesWithTickets[0];
        return this.next(selectedService.name);
    }

    next(serviceName: string): Ticket | null {
        const q = this.queues.get(serviceName);
        return q && q.length ? q.shift()! : null;
    }

    size(serviceName: string): number {
        return this.queues.get(serviceName)?.length ?? 0;
    }

    hasNext(serviceName: string): boolean {
        return this.size(serviceName) > 0;
    }

    reset(): void {
        this.seq = 1;
        this.queues.clear();
    }
}

export const queueService = new QueueService();
export default QueueService;

