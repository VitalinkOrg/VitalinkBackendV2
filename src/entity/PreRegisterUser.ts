// src/entity/User.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../../tenshi/entity/User";
import { UnitDynamicCentral } from "../../tenshi/entity/UnitDynamicCentral";
@Entity("pre_register_user")
export class PreRegisterUser {
@PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "varchar", length: 500 })
  card_id: string;

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

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at: Date;

  @Column({ type: "datetime", nullable: true, default: null })
  verified_at: Date | null;
}