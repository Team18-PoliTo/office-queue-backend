import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  Column,
} from "typeorm";
import ServiceDAO from "./ServiceDAO";

@Entity("counters")
class CounterDAO {
  @PrimaryGeneratedColumn({ type: "integer" })
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @ManyToMany(() => ServiceDAO)
  @JoinTable() // Owning side of the relationship
  services: ServiceDAO[];
}

export default CounterDAO;
