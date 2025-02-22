// src/entity/User.ts
import { User } from "@TenshiJS/entity/User";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
@Entity("pre_register_user")
export class PreRegisterUser {
@PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "int", unsigned: true, nullable: true })
  card_id: number | null;

  @Column({ type: "varchar", length: 250 })
  first_name: string;

  @Column({ type: "varchar", length: 250 })
  last_name: string;

  @Column({ type: "varchar", length: 250, nullable: true, default: null })
  address: string | null;

  @Column({ type: "datetime", nullable: true, default: null })
  birth_date: Date | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user", referencedColumnName: "id" })
  cooperative: User;

  @Column({ type: "tinyint", default: 0 })
  is_deleted: boolean;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at: Date;

  @Column({ type: "datetime", nullable: true, default: null })
  verified_at: Date | null;
}