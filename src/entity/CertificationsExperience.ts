import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Supplier } from "../../tenshi/entity/Supplier";
import { UnitDynamicCentral } from "@TenshiJS/entity/UnitDynamicCentral";

/**
 * The EducationExperience table stores information about a supplier's 
 * (doctor's) education and professional experience. It includes details 
 * such as the institution name, period of study or work, location, and 
 * whether the position is currently held. This table helps track a 
 * medical professional's qualifications and career history.
 */

@Entity("certifications_and_experience")
export class CertificationsExperience  {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @ManyToOne(() => Supplier, { eager: true })
  @JoinColumn({ name: "supplier", referencedColumnName: "id" })
  supplier: Supplier;

  @Column({ type: "date" })
  start_date: Date;

  @Column({ type: "date", nullable: true })
  end_date: Date | null;

  @Column({ type: "varchar", length: 500, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  name: string;

  @Column({ type: "varchar", length: 500, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  company_name: string;

  @Column({ type: "varchar", length: 250, nullable: true, default: null, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  province: string | null;

  @Column({ type: "varchar", length: 500, nullable: true, default: null, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  address: string | null;

  @Column({ type: "varchar", length: 250, nullable: true, default: null, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  city_name: string | null;

  @Column({ type: "varchar", length: 10, charset: "utf8mb4", collation: "utf8mb4_unicode_ci", default: "CRC" })
  country_iso_code: string;

  @Column({ type: "boolean", default: false })
  is_currently: boolean;

  @Column({ type: "varchar", length: 2000, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  url_document: string;

  //EXPERIENCE_TYPE
  @ManyToOne(() => UnitDynamicCentral)
  @JoinColumn({ name: "experience_type", referencedColumnName: "code"})
  experience_type: UnitDynamicCentral | null;

  @Column({ type: "tinyint", default: 0 })
  is_deleted: boolean;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
  created_date: Date | null;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_date: Date | null;
}
