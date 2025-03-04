import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Appointment } from "./Appointment";
import { UnitDynamicCentral } from "@TenshiJS/entity/UnitDynamicCentral";

/**
 * The AppointmentCredit table stores credit-related information for medical appointments. 
 * It includes details such as the requested and approved credit amounts, credit status, 
 * and any observations related to the credit request. Additionally, it allows storing 
 * a reference to a "PAGARE" document with payment conditions. 
 */

@Entity("appointment_credit")
export class AppointmentCredit {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @ManyToOne(() => Appointment, { eager: true })
  @JoinColumn({ name: "appointment_id", referencedColumnName: "id" })
  appointment: Appointment;

  //ASKING_CREDIT_STATUS
  @ManyToOne(() => UnitDynamicCentral)
  @JoinColumn({ name: "credit_status", referencedColumnName: "code" })
  credit_status: UnitDynamicCentral;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  requested_amount: number | null;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  approved_amount: number | null;

  @Column({ type: "text", nullable: true })
  credit_observations: string | null;

  //the code of document for "PAGARE with payment conditions"
  @Column({ type: "varchar", length: 100, nullable: true, default: null })
  pagare_file_code: string | null;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
  created_date: Date | null;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_date: Date | null;
}
