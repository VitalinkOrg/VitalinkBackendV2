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
  @JoinColumn({ name: "appointment", referencedColumnName: "id" })
  appointment: Appointment;

  //ASKING_CREDIT_STATUS
  @Column({ name: "credit_status_code", default: "REQUIRED" })
  credit_status_code: string;

  @ManyToOne(() => UnitDynamicCentral)
  @JoinColumn({ name: "credit_status_code", referencedColumnName: "code" })
  credit_status: UnitDynamicCentral;


  //request amount from user
  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  requested_amount: number | null;

  //approved amount from legal entity
  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  approved_amount: number | null;

  @Column({ type: "text", nullable: true, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  credit_observations: string | null;

  //the code of document for "PAGARE with payment conditions"
  @Column({ type: "varchar", length: 100, nullable: true, default: null, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  pagare_file_code: string | null;

  //THE MAX DATE OF USE THE CREDIT  
  @Column({ type: "timestamp", nullable: true, default: () => null })
  max_date_active: Date | null;

  //HAS IT ALREADY BEEN USED?
   @Column({ type: "tinyint", default: 0 })
  already_been_used: boolean;


  @Column({ type: "tinyint", default: 0 })
  is_deleted: boolean;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
  created_date: Date | null;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_date: Date | null;
}
