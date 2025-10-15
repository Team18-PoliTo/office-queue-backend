import request from 'supertest';
import express from 'express';
import serviceRoutes from '../../src/routes/serviceRoutes';
import ticketRoutes from '../../src/routes/ticketRoutes';
import counterRoutes from '../../src/routes/counterRoutes';
import { validateUserType } from '../../src/middleware/authMiddleware';
import { initializeDatabase, closeDatabase } from '../../src/config/database';

const app = express();
app.use(express.json());

// Apply auth middleware globally (same as main app)
app.use('/api', validateUserType);

// Mount routes
app.use('/api/services', serviceRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/counter', counterRoutes);

describe('Authorization Integration Tests', () => {
    beforeAll(async () => {
        await initializeDatabase();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    describe('Missing user-type header', () => {
        it('should return 401 for GET /api/services without user-type header', async () => {
            const response = await request(app)
                .get('/api/services');

            expect(response.status).toBe(401);
            expect(response.body).toEqual({ message: 'user-type header is required' });
        });

        it('should return 401 for POST /api/tickets without user-type header', async () => {
            const response = await request(app)
                .post('/api/tickets')
                .send({ serviceId: 1 });

            expect(response.status).toBe(401);
            expect(response.body).toEqual({ message: 'user-type header is required' });
        });

        it('should return 401 for GET /api/counter/:id without user-type header', async () => {
            const response = await request(app)
                .get('/api/counter/1');

            expect(response.status).toBe(401);
            expect(response.body).toEqual({ message: 'user-type header is required' });
        });

        it('should return 401 for GET /api/counter/:id/next without user-type header', async () => {
            const response = await request(app)
                .get('/api/counter/1/next');

            expect(response.status).toBe(401);
            expect(response.body).toEqual({ message: 'user-type header is required' });
        });
    });

    describe('Invalid user-type header', () => {
        it('should return 401 for GET /api/services with invalid user-type', async () => {
            const response = await request(app)
                .get('/api/services')
                .set('user-type', 'invalid');

            expect(response.status).toBe(401);
            expect(response.body).toEqual({ message: 'Invalid user-type' });
        });

        it('should return 401 for POST /api/tickets with invalid user-type', async () => {
            const response = await request(app)
                .post('/api/tickets')
                .set('user-type', 'admin')
                .send({ serviceId: 1 });

            expect(response.status).toBe(401);
            expect(response.body).toEqual({ message: 'Invalid user-type' });
        });
    });

    describe('Wrong role access (403 Forbidden)', () => {
        it('should return 403 when officer tries to access GET /api/services (customer only)', async () => {
            const response = await request(app)
                .get('/api/services')
                .set('user-type', 'officer');

            expect(response.status).toBe(403);
            expect(response.body).toEqual({ message: 'Forbidden: insufficient permissions' });
        });

        it('should return 403 when officer tries to access POST /api/tickets (customer only)', async () => {
            const response = await request(app)
                .post('/api/tickets')
                .set('user-type', 'officer')
                .send({ serviceId: 1 });

            expect(response.status).toBe(403);
            expect(response.body).toEqual({ message: 'Forbidden: insufficient permissions' });
        });

        it('should return 403 when customer tries to access GET /api/counter/:id (officer only)', async () => {
            const response = await request(app)
                .get('/api/counter/1')
                .set('user-type', 'customer');

            expect(response.status).toBe(403);
            expect(response.body).toEqual({ message: 'Forbidden: insufficient permissions' });
        });

        it('should return 403 when customer tries to access GET /api/counter/:id/next (officer only)', async () => {
            const response = await request(app)
                .get('/api/counter/1/next')
                .set('user-type', 'customer');

            expect(response.status).toBe(403);
            expect(response.body).toEqual({ message: 'Forbidden: insufficient permissions' });
        });
    });

    describe('Correct role access (200 or appropriate status)', () => {
        it('should allow customer to access GET /api/services', async () => {
            const response = await request(app)
                .get('/api/services')
                .set('user-type', 'customer');

            expect(response.status).toBe(200);
        });

        it('should allow customer to access POST /api/tickets', async () => {
            const response = await request(app)
                .post('/api/tickets')
                .set('user-type', 'customer')
                .send({ serviceId: 1 });

            // Should not be 401 or 403 (could be 200 or 400 depending on business logic)
            expect(response.status).not.toBe(401);
            expect(response.status).not.toBe(403);
        });

        it('should allow officer to access GET /api/counter/:id', async () => {
            const response = await request(app)
                .get('/api/counter/1')
                .set('user-type', 'officer');

            // Should not be 401 or 403 (could be 200 or 404 depending on data)
            expect(response.status).not.toBe(401);
            expect(response.status).not.toBe(403);
        });

        it('should allow officer to access GET /api/counter/:id/next', async () => {
            const response = await request(app)
                .get('/api/counter/1/next')
                .set('user-type', 'officer');

            // Should not be 401 or 403 (could be 200 or 404 depending on data)
            expect(response.status).not.toBe(401);
            expect(response.status).not.toBe(403);
        });
    });
});

