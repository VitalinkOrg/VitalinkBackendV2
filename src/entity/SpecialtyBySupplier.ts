import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Supplier } from "../../tenshi/entity/Supplier";
import { UnitDynamicCentral } from "../../tenshi/entity/UnitDynamicCentral";

/*
  One supplier can have any specialties
  The specialties are defined in UDC with the code MEDICAL_SPECIALTY

  The specialties are for example: 
  * Cardiología
  * Cirugía General
  * Dermatología
  * Gastroenterología
  * Pediatría
  * Psiquiatria
*/
@Entity("specialty_by_supplier")
export class SpecialtyBySupplier {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: "supplier", referencedColumnName: "id" })
  supplier: Supplier;

  //MEDICAL_SPECIALTY
  @ManyToOne(() => UnitDynamicCentral)
  @JoinColumn({ name: "medical_specialty", referencedColumnName: "code" })
  medical_specialty: UnitDynamicCentral;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
  created_date: Date | null;
}
