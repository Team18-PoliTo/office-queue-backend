import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";

@Entity("services")
 class ServiceDAO {
  @PrimaryGeneratedColumn({ type: "integer" })
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ type: "float", nullable: false })
  avg_process_time: number;

}

export default ServiceDAO;
