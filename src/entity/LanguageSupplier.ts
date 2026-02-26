import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Supplier } from "../../tenshi/entity/Supplier";
import { UnitDynamicCentral } from "@TenshiJS/entity/UnitDynamicCentral";

@Entity("languages_supplier")
export class LanguageSupplier  {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: "supplier", referencedColumnName: "id" })
  supplier: Supplier;

  //LANGUAGE_PROFICIENCY
  @ManyToOne(() => UnitDynamicCentral)
  @JoinColumn({ name: "language_proficiency", referencedColumnName: "code"})
  language_proficiency: UnitDynamicCentral | null;

  @Column({ type: "varchar", length: 10 })
  language_code: string;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
  created_date: Date | null;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_date: Date | null;
}
