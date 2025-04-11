import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

import { ProcedureBySpecialty } from "./ProcedureBySpecialty";
import { Supplier } from "./Supplier";
import { Location } from "./Location";


/**
 * The Availability table stores the availability schedule of a supplier 
 * (doctor or hospital) for specific medical procedures. It includes 
 * the day of the week, available time slots, and the location where 
 * the procedure is performed. This table helps manage scheduling and 
 * appointments efficiently.
 * 
 * 
 * The location could be null, because the legal representative IS a primary hospital.
 */

@Entity("availability")
export class Availability {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: "supplier", referencedColumnName: "id" })
  supplier: Supplier;

  @ManyToOne(() => ProcedureBySpecialty)
  @JoinColumn({ name: "procedure", referencedColumnName: "id" })
  procedure: ProcedureBySpecialty;

  @ManyToOne(() => Location)
  @JoinColumn({ name: "location", referencedColumnName: "id" })
  location: Location | null;

  @Column({ type: "varchar", length: 20, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  weekday: string;

  @Column({ type: "time" })
  from_hour: string;

  @Column({ type: "time" })
  to_hour: string;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
  created_date: Date | null;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_date: Date | null;
}
