import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { UnitDynamicCentral } from "@TenshiJS/entity/UnitDynamicCentral";
import { User } from "@TenshiJS/entity/User";
@Entity("supplier_education")
export class SupplierEducationExperience {
@PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user", referencedColumnName: "id" })
  supplier: User;

  @ManyToOne(() => UnitDynamicCentral)
  @JoinColumn({ name: "supplier_type", referencedColumnName: "code" })
  supplier_type: UnitDynamicCentral;

  @Column({ type: "varchar", length: 100, nullable: true, default: null })
  start_date: string | null;

  @Column({ type: "varchar", length: 100, nullable: true, default: null })
  end_date: string | null;

  @Column({ type: "tinyint", default: 0 })
  is_currently: boolean;

  @Column({ type: "varchar", length: 250 })
  title_name: string;

  @Column({ type: "varchar", length: 250, nullable: true, default: null })
  company_name: string | null;

  @Column({ type: "varchar", length: 3, nullable: true, default: null })
  country_iso_code: string | null;

  @Column({ type: "varchar", length: 250, nullable: true, default: null })
  address: string | null;

  @Column({ type: "varchar", length: 200, nullable: true, default: null })
  city_name: string | null;

  @Column({ type: "varchar", length: 50, nullable: true, default: null })
  postal_code: string | null;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at: Date;

  @Column({ type: "datetime", nullable: true, default: null })
  verified_at: Date | null;
}