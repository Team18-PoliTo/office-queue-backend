import { MigrationInterface, QueryRunner } from "typeorm";

export class Seed1744607160000
 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      // default services
      await queryRunner.query(`
            INSERT INTO services (name, avg_process_time) VALUES
            ('A', 5.0),
            ('B', 10.0),
            ('C', 7.5);
        `);

        // default counters
        await queryRunner.query(`
            INSERT INTO counters (name) VALUES
            ('Counter 1'),
            ('Counter 2'),
            ('Counter 3');
        `);

        // Fetch inserted services and counters to get their IDs
        const services = await queryRunner.query(`SELECT id FROM services`);
        const counters = await queryRunner.query(`SELECT id FROM counters`);

        // Establish many-to-many relationships
        // Counter 1 → Service 1, Service 2
        await queryRunner.query(`
            INSERT INTO counters_services (counterId, serviceId) VALUES
            (${counters[0].id}, ${services[0].id}),
            (${counters[0].id}, ${services[1].id})
        `);

        // Counter 2 → Service 2, Service 3
        await queryRunner.query(`
            INSERT INTO counters_services (counterId, serviceId) VALUES
            (${counters[1].id}, ${services[1].id}),
            (${counters[1].id}, ${services[2].id})
        `);

        // Counter 3 → Service 1, Service 3
        await queryRunner.query(`
            INSERT INTO counters_services (counterId, serviceId) VALUES
            (${counters[2].id}, ${services[0].id}),
            (${counters[2].id}, ${services[2].id})
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM counters_services`);
        await queryRunner.query(`DELETE FROM services`);
        await queryRunner.query(`DELETE FROM counters`);
    }
}
