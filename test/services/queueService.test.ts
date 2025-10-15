import { queueService } from '../../src/services/queueService';

describe('QueueService', () => {
    beforeEach(() => {
        queueService.reset();
    });

    describe('create', () => {
        it('should create a ticket with correct properties', () => {
            const ticket = queueService.create('A');
            
            expect(ticket.id).toBe(1);
            expect(ticket.serviceName).toBe('A');
            expect(ticket.timestamp).toBeInstanceOf(Date);
        });

        it('should add ticket to the correct service queue', () => {
            queueService.create('A');
            queueService.create('A');
            queueService.create('B');
            
            expect(queueService.size('A')).toBe(2);
            expect(queueService.size('B')).toBe(1);
        });
    });

    describe('getNextTicket - longest queue first', () => {
        const mockServices = [
            { name: 'A', avg_process_time: 5 },
            { name: 'B', avg_process_time: 3 },
            { name: 'C', avg_process_time: 7 }
        ];

        it('should return null when empty services array', () => {
            queueService.create('A');
            const ticket = queueService.getNextTicket([]);
            expect(ticket).toBeNull();
        });

        it('should return null when all queues are empty', () => {
            const ticket = queueService.getNextTicket(mockServices);
            expect(ticket).toBeNull();
        });

        it('should select from longest queue when lengths differ', () => {
            // Create tickets: A=3, B=1, C=2
            queueService.create('A');
            queueService.create('A');
            queueService.create('A');
            queueService.create('B');
            queueService.create('C');
            queueService.create('C');

            const ticket = queueService.getNextTicket(mockServices);
            expect(ticket?.serviceName).toBe('A');
        });

        it('should select service with lowest average service time when queue lengths are equal', () => {
            // Create tickets: A=1, B=1, C=1 (all equal length)
            queueService.create('A');
            queueService.create('B');
            queueService.create('C');

            const ticket = queueService.getNextTicket(mockServices);
            expect(ticket?.serviceName).toBe('B'); // B has lowest service time (3)
        });
    });

    describe('FIFO behavior', () => {
        it('should serve tickets in first-in-first-out order', () => {
            const ticket1 = queueService.create('A');
            const ticket2 = queueService.create('A');

            const services = [{ name: 'A', avg_process_time: 5 }];

            const served1 = queueService.getNextTicket(services);
            const served2 = queueService.getNextTicket(services);

            expect(served1?.id).toBe(ticket1.id);
            expect(served2?.id).toBe(ticket2.id);
        });
    });

    describe('next', () => {
        it('should return null when queue is empty', () => {
            queueService.create('A');
            queueService.next('A'); // Remove the only ticket
            
            const ticket = queueService.next('A'); // Try to get from empty queue
            expect(ticket).toBeNull();
        });

        it('should return null when service does not exist', () => {
            const ticket = queueService.next('NonExistent');
            expect(ticket).toBeNull();
        });
    });

    describe('hasNext', () => {
        it('should return false when queue is empty', () => {
            expect(queueService.hasNext('A')).toBe(false);
        });

        it('should return true when queue has tickets', () => {
            queueService.create('A');
            expect(queueService.hasNext('A')).toBe(true);
        });
    });

    describe('reset', () => {
        it('should reset all queues and ticket counter', () => {
            queueService.create('A');
            queueService.create('B');
            
            queueService.reset();
            
            expect(queueService.size('A')).toBe(0);
            expect(queueService.size('B')).toBe(0);
            
            const newTicket = queueService.create('A');
            expect(newTicket.id).toBe(1);
        });
    });
});