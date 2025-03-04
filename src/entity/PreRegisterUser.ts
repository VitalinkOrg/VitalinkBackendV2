// src/entity/User.ts
import { UnitDynamicCentral } from "@TenshiJS/entity/UnitDynamicCentral";
import { User } from "@TenshiJS/entity/User";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

/**
 * The PreRegisterUser table stores basic user information before they 
 * fully register in the application. It includes identification details, 
 * name, address, birth date, and references to classification types 
 * (`id_type`) and financial entities (`finance_entity`). This table 
 * ensures that users go through a pre-registration process before 
 * gaining full access.
 */

@Entity("pre_register_user")
export class PreRegisterUser {
@PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "varchar", length: 500 })
  card_id: string;

  //ID_TYPE
  @ManyToOne(() => UnitDynamicCentral, { eager: true })
  @JoinColumn({ name: "id_type", referencedColumnName: "code" })
  id_type: UnitDynamicCentral;

  @Column({ type: "varchar", length: 500 })
  name: string;

  @Column({ type: "varchar", length: 250, nullable: true, default: null })
  address: string | null;

  @Column({ type: "datetime", nullable: true, default: null })
  birth_date: Date | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user", referencedColumnName: "id" })
  finance_entity: User;

  @Column({ type: "tinyint", default: 0 })
  is_deleted: boolean;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
  created_date: Date | null;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_date: Date | null;
}