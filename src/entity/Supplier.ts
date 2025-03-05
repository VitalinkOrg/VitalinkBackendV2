import { UnitDynamicCentral } from "@TenshiJS/entity/UnitDynamicCentral";
import { User } from "@TenshiJS/entity/User";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

/**
 * The Supplier table stores information about healthcare providers, 
 * including individual medical professionals and hospitals. It contains 
 * details such as medical license numbers, location, contact information, 
 * experience, and specialization. The table also supports hierarchical 
 * classification through `id_type` and `medical_type`.
 */

@Entity("suppliers")
export class Supplier {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  //ID_TYPE
  @ManyToOne(() => UnitDynamicCentral, { eager: true })
  @JoinColumn({ name: "id_type", referencedColumnName: "code" })
  id_type: UnitDynamicCentral;

  @Column({ type: "varchar", length: 100, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  card_id: string;

  @Column({ type: "varchar", length: 200, nullable: true, default: null, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  num_medical_enrollment: string | null;

  @Column({ type: "varchar", length: 500, nullable: true, default: null, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  name: string | null;

  @Column({ type: "varchar", length: 20, nullable: true })
  phone_number: string | null;

  @Column({ type: "varchar", length: 250, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  email: string;

  @Column({ type: "varchar", length: 10, nullable: true,  default: "CRC" })
  country_iso_code: string | null;

  @Column({ type: "varchar", length: 250, nullable: true, default: null, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  province: string | null;

  @Column({ type: "varchar", length: 250, nullable: true, default: null, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  city_name: string | null;

  @Column({ type: "varchar", length: 20, nullable: true, default: null, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  postal_code: string | null;

  @Column({ type: "varchar", length: 500, nullable: true, default: null, charset: "utf8mb4", collation: "utf8mb4_unicode_ci"})
  profile_picture_url: string | null;

  @Column({ type: "text", nullable: true, default: null, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  description: string | null;

  @Column({ type: "varchar", length: 500, nullable: true, default: null, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  address: string | null;

  @Column({ type: "varchar", length: 50, nullable: true, default: null, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  street_number: string | null;

  @Column({ type: "int", nullable: true })
  floor: number | null;

  @Column({ type: "int", nullable: true })
  door_number: number | null;

  @Column({ type: "decimal", precision: 10, scale: 6, nullable: true })
  latitude: number | null;

  @Column({ type: "decimal", precision: 10, scale: 6, nullable: true })
  longitude: number | null;

  @Column({ type: "int", nullable: true })
  experience_years: number | null;

  @Column({ type: "int", nullable: true })
  patients_number: number | null;

  @Column({ type: "boolean", default: false })
  is_hospital: boolean;

  @Column({ type: "text", nullable: true, default: null, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  our_history: string | null;

  @Column({ type: "text", nullable: true, default: null, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  mission: string | null;

  @Column({ type: "text", nullable: true, default: null, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  vision: string | null;

  @Column({ type: "varchar", length: 100, nullable: true, default: null, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  code_card_id_file: string | null;

  @Column({ type: "varchar", length: 100, nullable: true, default: null, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  code_medical_license_file: string | null;

  @Column({ type: "enum", enum: ["M", "F", "O"], nullable: true, default: null })
  gender: "M" | "F" | "O" | null; 

  //MEDICAL_TYPE
  //medico especialista
  //generalista
  @ManyToOne(() => UnitDynamicCentral)
  @JoinColumn({ name: "medical_type", referencedColumnName: "code"})
  medical_type: UnitDynamicCentral | null;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "user", referencedColumnName: "id" })
  legal_representative: User;

  @Column({ type: "tinyint", default: 0 })
  is_deleted: boolean;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
  created_date: Date | null;

  @Column({ type: "timestamp", nullable: true,  default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_date: Date | null;
}
