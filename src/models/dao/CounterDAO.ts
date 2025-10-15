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

  @ManyToMany(() => ServiceDAO, { eager: true })
  @JoinTable({
    name: "counters_services",
    joinColumn: {
      name: "counterId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "serviceId",
      referencedColumnName: "id",
    },
  }) // Owning side of the relationship - explicit table/columns to match migration
  services: ServiceDAO[];
}

export default CounterDAO;
