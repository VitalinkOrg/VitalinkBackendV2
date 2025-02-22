import { User } from "@TenshiJS/entity/User";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
@Entity("doctor_hospital")
export class DoctorHospital {
@PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user", referencedColumnName: "id" })
  user: User;

  @Column({ type: "varchar", length: 150, nullable: true, default: null })
  floor: string | null;

  @Column({ type: "varchar", length: 10,  nullable: true, default: null })
  door_number: string | null;

  @Column({ type: "varchar", length: 10, nullable: true, default: null })
  experience: string | null;

  @Column({ type: "int", unsigned: true, nullable: true })
  patients_number: number | null;

  @Column({ type: "tinyint", default: 0 })
  is_hospital: boolean;

  @Column({ type: "varchar", length: 500, nullable: true, default: null })
  our_history: string | null;

  @Column({ type: "varchar", length: 500, nullable: true, default: null })
  mision: string | null;

  @Column({ type: "varchar", length: 500, nullable: true, default: null })
  vision: string | null;

  @Column({ type: "tinyint", default: 0 })
  is_deleted: boolean;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at: Date;

  @Column({ type: "datetime", nullable: true, default: null })
  verified_at: Date | null;
}