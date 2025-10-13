import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity({ name: "tickets" })
export class TicketDAO {
    @PrimaryGeneratedColumn({ type: "integer" })
    id!: number;

    @Column({ name: "service_name", nullable: false })
    serviceName!: string;

    @CreateDateColumn({ name: "timestamp", type: "datetime" })
    timestamp!: Date;
}

export default TicketDAO;
