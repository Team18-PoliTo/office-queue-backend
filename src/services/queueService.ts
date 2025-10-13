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

