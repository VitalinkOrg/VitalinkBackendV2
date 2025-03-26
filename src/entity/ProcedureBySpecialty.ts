import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { SpecialtyBySupplier } from "./SpecialtyBySupplier";
import { UnitDynamicCentral } from "../../tenshi/entity/UnitDynamicCentral";

/*
  This table is currently called SERVICES
  The specialties could have any specific procedures.
  The procedure is in the ui/ux the services availables
    For example: 
    1. Specialty Oftalmologia: 
        * Cirugía de Miopía
        * Cirugía de Cataratas
        * Tratamiento de Glaucoma
        
    2. Specialty Neurologia: 
        * Tratamiento de Epilepsia
        * Tratamiento de Parkinson   
        
    3. Specialty Cardiologia: 
        * Intervención Cardiovascular
        * Marcapasos  
*/
@Entity("procedure_by_specialty")
export class ProcedureBySpecialty {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @ManyToOne(() => SpecialtyBySupplier)
  @JoinColumn({ name: "specialty", referencedColumnName: "id" })
  specialty: SpecialtyBySupplier;

  //MEDICAL_PROCEDURE
  @ManyToOne(() => UnitDynamicCentral)
  @JoinColumn({ name: "procedure", referencedColumnName: "code" })
  procedure: UnitDynamicCentral;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
  created_date: Date | null;
}
