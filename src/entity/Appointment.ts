import { User } from "@TenshiJS/entity/User";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Supplier } from "./Supplier";
import { UnitDynamicCentral } from "@TenshiJS/entity/UnitDynamicCentral";
import { Package } from "./Package";
import { General } from "@index/consts/Const";


/**
 * The Appointment table stores information about medical appointments, 
 * including details about the customer, supplier (doctor or hospital), 
 * reservation type, status, payment details, and appointment results. 
 * It also includes fields for user descriptions, diagnoses, and post-appointment 
 * recommendations. 
 */

function generateRandomCode(length: number = 7): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIdx = Math.floor(Math.random() * chars.length);
    result += chars[randomIdx];
  }

  return result;
}


@Entity("appointments")
export class Appointment {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "varchar", length: 100, charset: "utf8mb4", collation: "utf8mb4_unicode_ci", default: generateRandomCode() })
  appointment_qr_code: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "customer", referencedColumnName: "id" })
  customer: User;

  //the code of document for the proforma 
  @Column({ type: "varchar", length: 100, nullable: true, default: null, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  proforma_file_code: string | null;

  @Column({ type: "date" })
  appointment_date: Date;

  @Column({ type: "time" })
  appointment_hour: string;

  @ManyToOne(() => Supplier, { eager: true })
  @JoinColumn({ name: "supplier", referencedColumnName: "id" })
  supplier: Supplier;

  @ManyToOne(() => Package)
  @JoinColumn({ name: "package", referencedColumnName: "id" })
  package: Package;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
  application_date: Date | null;

  @Column({ type: "text", nullable: true, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  user_description: string | null;

  @Column({ type: "text", nullable: true, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  recommendation_post_appointment: string | null;

  @Column({ type: "text", nullable: true, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  diagnostic: string | null;

  @Column({ type: "tinyint", default: 0 })
  is_for_external_user: boolean;

  @Column({ type: "varchar", length: 250, nullable: true, default: null })
  phone_number_external_user: string | null;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0})
  price_procedure: number;

  @Column({ type: "decimal", precision: 10, scale: 2,  default: General.minimumPriceAppointmentValorationReference})
  price_valoration_appointment: number;



  //********************************** */
  //            Foreign keys
  //********************************** */

  //APPOINTMENT_TYPE
  @Column({ name: "appointment_type_code", default: "VALORATION_APPOINTMENT" })
  appointment_type_code: string;

  @ManyToOne(() => UnitDynamicCentral)
  @JoinColumn({ name: "appointment_type_code", referencedColumnName: "code" })
  appointment_type: UnitDynamicCentral;


  //RESERVATION_TYPE
  @Column({ name: "reservation_type_code", default: "PRE_RESERVATION_VALORATION_APPOINTMENT" })
  reservation_type_code: string;

  @ManyToOne(() => UnitDynamicCentral)
  @JoinColumn({ name: "reservation_type_code", referencedColumnName: "code" })
  reservation_type: UnitDynamicCentral;


  //APPOINTMENT_STATUS
  @Column({ name: "appointment_status_code",  default: "PENDING_VALORATION_APPOINTMENT" })
  appointment_status_code: string;

  @ManyToOne(() => UnitDynamicCentral)
  @JoinColumn({ name: "appointment_status_code", referencedColumnName: "code" })
  appointment_status: UnitDynamicCentral;

 
  //PAYMENT_STATUS
  @Column({ name: "payment_status_code", default: "PAYMENT_STATUS_NOT_PAID_VALORATION_APPOINTMENT" })
  payment_status_code: string;

  @ManyToOne(() => UnitDynamicCentral)
  @JoinColumn({ name: "payment_status_code", referencedColumnName: "code" })
  payment_status: UnitDynamicCentral;


  //PAYMENT_METHOD
  @ManyToOne(() => UnitDynamicCentral)
  @JoinColumn({ name: "payment_method_code", referencedColumnName: "code" })
  payment_method: UnitDynamicCentral | null;


  //APPOINTMENT_RESULT
  @ManyToOne(() => UnitDynamicCentral)
  @JoinColumn({ name: "appointment_result_code", referencedColumnName: "code" })
  appointment_result: UnitDynamicCentral | null;

  


   //********************************** */
  //            BASIC FIELDS
  //********************************** */
  @Column({ type: "tinyint", default: 0 })
  is_deleted: boolean;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
  created_date: Date | null;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_date: Date | null;
}
