import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import CounterDAO from "./CounterDAO";

@Entity("services")
class ServiceDAO {
  @PrimaryGeneratedColumn({ type: "integer" })
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ type: "float", nullable: false })
  avg_process_time: number;

  @ManyToMany(() => CounterDAO, (counter) => counter.services)
  counters: CounterDAO[];
}

export default ServiceDAO;
