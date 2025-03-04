import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ProcedureBySpecialty } from "./ProcedureBySpecialty";
import { UnitDynamicCentral } from "../../tenshi/entity/UnitDynamicCentral";

/*
  This is the list of products by procedure, or in other words this is the packages
  We can set the product by procedure of set it on null.
  We have the price, the service offer and description.
  For example the packages are:
    1. Procedure "Cirugia de Miopia":
      * Cirugía Miopía Láser
      * Cirugía Miopía Lentes Intraoculares
      * Cirugía Miopía Anillos
*/
@Entity("packages")
export class Package {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @ManyToOne(() => ProcedureBySpecialty, { eager: true })
  @JoinColumn({ name: "procedure", referencedColumnName: "id" })
  procedure: ProcedureBySpecialty;

  //MEDICAL_PRODUCT
  @ManyToOne(() => UnitDynamicCentral)
  @JoinColumn({ name: "product", referencedColumnName: "code" })
  product: UnitDynamicCentral | null;

  @Column({ type: "decimal", scale: 2, nullable: false })
  reference_price: number;

  @Column({ type: "decimal", scale: 2, nullable: true, default: 0 })
  discount: number;

  /*
  {
    "ASSESSMENT_DETAILS": [
        "GENERAL_ANESTHESIA",
        "REGIONAL_ANESTHESIA",
        "POSTOP_PAIN_CONTROL",
        "POSTOP_ULTRASOUND",
        "POSTOP_CT",
        "POSTOP_PHYSIOTHERAPY"
    ]
  }
  */
 //This fill the list of assesments to check the list of "services" in packages
  @Column({ type: "json", nullable: true })
  services_offer: any;

  @Column({ type: "varchar", length: 500, nullable: true, default: null })
  description: string | null;

  @Column({ type: "tinyint", default: 0 })
  is_deleted: boolean;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
  created_date: Date | null;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_date: Date | null;
}
