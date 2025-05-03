// src/entity/UnitDynamicCentral.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

/**
 * The UnitDynamicCentral table is a centralized reference system for storing 
 * various classifications such as medical specialties, procedures, products, 
 * assessments, appointment statuses, and payment-related types. 
 * It supports hierarchical relationships via the `father_code` field.
 */

@Entity("units_dynamic_central")
export class UnitDynamicCentral {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "varchar", length: 100, unique: true })
  code: string;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "enum", enum: ["RESERVATION_TYPE", 
                                "APPOINTMENT_STATUS", 
                                "REVIEW", 
                                "PAYMENT_STATUS",
                                "PAYMENT_METHOD",
                                "ASKING_CREDIT_STATUS",
                                "EXPERIENCE_TYPE",
                                "ID_TYPE",
                                "MEDICAL_TYPE",
                                "MEDICAL_SPECIALTY",
                                "MEDICAL_PROCEDURE",
                                "MEDICAL_PRODUCT",
                                "ASSESSMENT",
                                "ASSESSMENT_DETAIL",
                                "APPOINTMENT_RESULT",
                                "LANGUAGE_PROFICIENCY"], 
                                nullable: true })
  type: string | null;

  @Column({ type: "varchar", length: 500, nullable: true, default: null })
  description: string | null;

  @Column({ type: "varchar", length: 200, nullable: true, default: null })
  father_code: string | null;

  //PRODUCT -> PRICE REFERENCE
  @Column({ type: "varchar", length: 300, nullable: true, default: null })
  value1: string;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created_date: Date;

  @Column({ type: "datetime", nullable: true, default: null })
  updated_date: Date | null;

  @Column({ type: "tinyint", default: 0 })
  is_deleted: boolean;

}
