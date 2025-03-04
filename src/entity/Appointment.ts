import { User } from "@TenshiJS/entity/User";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Supplier } from "./Supplier";
import { UnitDynamicCentral } from "@TenshiJS/entity/UnitDynamicCentral";


/**
 * The Appointment table stores information about medical appointments, 
 * including details about the customer, supplier (doctor or hospital), 
 * reservation type, status, payment details, and appointment results. 
 * It also includes fields for user descriptions, diagnoses, and post-appointment 
 * recommendations. 
 */

@Entity("appointments")
export class Appointment {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "customer_id", referencedColumnName: "id" })
  customer: User;

  //the code of document for the proforma 
  @Column({ type: "varchar", length: 100, nullable: true, default: null })
  proforma_file_code: string | null;

  @Column({ type: "date" })
  appointment_date: Date;

  @Column({ type: "time" })
  appointment_hour: string;

  //RESERVATION_TYPE
  @ManyToOne(() => UnitDynamicCentral)
  @JoinColumn({ name: "reservation_type", referencedColumnName: "code" })
  reservation_type: UnitDynamicCentral;

  //APPOINTMENT_STATUS
  @ManyToOne(() => UnitDynamicCentral)
  @JoinColumn({ name: "appointment_status", referencedColumnName: "code" })
  appointment_status: UnitDynamicCentral | null;

  @ManyToOne(() => Supplier, { eager: true })
  @JoinColumn({ name: "supplier", referencedColumnName: "id" })
  supplier: Supplier;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
  application_date: Date | null;

  //PAYMENT_STATUS
  @ManyToOne(() => UnitDynamicCentral)
  @JoinColumn({ name: "payment_status", referencedColumnName: "code" })
  payment_status: UnitDynamicCentral | null;

  //PAYMENT_METHOD
  //This can be in different table for add information when the user pays with different payment methods
  //and registry the traceability of payments
  //But V1 is just this column
  @ManyToOne(() => UnitDynamicCentral)
  @JoinColumn({ name: "payment_method", referencedColumnName: "code" })
  payment_method: UnitDynamicCentral | null;

  //APPOINTMENT_RESULT
  @ManyToOne(() => UnitDynamicCentral)
  @JoinColumn({ name: "appointment_result", referencedColumnName: "code" })
  appointment_result: UnitDynamicCentral | null;

  @Column({ type: "text", nullable: true })
  user_description: string | null;

  @Column({ type: "text", nullable: true })
  recommendation_post_appointment: string | null;

  @Column({ type: "text", nullable: true })
  diagnostic: string | null;

  @Column({ type: "tinyint", default: 0 })
  is_deleted: boolean;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
  created_date: Date | null;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_date: Date | null;
}
