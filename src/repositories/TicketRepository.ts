import { AppDataSource } from "../config/database";
import { TicketDAO } from "../models/dao/TicketDAO";
import { Repository } from "typeorm";

export class TicketRepository {
    private repo: Repository<TicketDAO> = AppDataSource.getRepository(TicketDAO);

    async create(serviceName: string): Promise<TicketDAO> {
        const ticket = this.repo.create({ serviceName });
        return await this.repo.save(ticket);
    }

    async countByService(serviceName: string): Promise<number> {
        return await this.repo.count({ where: { serviceName } });
    }
}

export default TicketRepository;

