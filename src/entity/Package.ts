import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { UnitDynamicCentral } from "../../tenshi/entity/UnitDynamicCentral";
import { SpecialtyBySupplier } from "./SpecialtyBySupplier";

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

  @ManyToOne(() => SpecialtyBySupplier)
  @JoinColumn({ name: "specialty", referencedColumnName: "id" })
  specialty: SpecialtyBySupplier;

  @ManyToOne(() => UnitDynamicCentral)
  @JoinColumn({ name: "procedure", referencedColumnName: "code" })
  procedure: UnitDynamicCentral;

  //MEDICAL_PRODUCT
  @ManyToOne(() => UnitDynamicCentral)
  @JoinColumn({ name: "product", referencedColumnName: "code" })
  product: UnitDynamicCentral;

  @Column({ type: "decimal", scale: 2, nullable: true, default: null })
  discount: number | null;

  @Column({ type: "decimal", scale: 2, nullable: true, default: null })
  postoperative_assessments: number | null;

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
  services_offer: any|null;

  @Column({ type: "tinyint", default: 0 })
  is_king: boolean;

  @Column({ type: "varchar", length: 500, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  observations: string;


  @Column({ type: "tinyint", default: 0 })
  is_deleted: boolean;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
  created_date: Date | null;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_date: Date | null;
}
