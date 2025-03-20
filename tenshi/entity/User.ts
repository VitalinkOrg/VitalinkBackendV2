// src/entity/User.ts
import { Exclude } from "class-transformer";
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from "typeorm";
import { UnitDynamicCentral } from "./UnitDynamicCentral";

/*
 This is the table for users, each user that need to login and register, need to be here.
 We have some differents roles
  SUPER_ADMIN: This is the user that can be everything.
  LEGAL_REPRESENTATIVE: This is the legal representative/contractor of the suppliers (medical/hospitals).
  CUSTOMER: This is the normal user to login into app to use all the flow of the app.
  FINANCE_ENTITY: This is the cooperative/company of the preview user registered.

 We have the column finance entity, this is for normal users (customers), that need to have the finance entity match, is the only user with this file "required"
*/
@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 500, unique: true})
  card_id: string;

  @ManyToOne(() => UnitDynamicCentral, { eager: true })
  @JoinColumn({ name: "id_type", referencedColumnName: "code" })
  id_type: UnitDynamicCentral;

  @Column({ type: "varchar", length: 500 })
  name: string;

  @Column({ type: "varchar", length: 250, unique: true })
  email: string;

  @Column({ type: "varchar", length: 250, unique: true, nullable: true, default: null })
  user_name: string;

  @Column({ type: "varchar", length: 250, nullable: true, default: null })
  phone_number: string | null;

  @Exclude()
  @Column({ type: "varchar", length: 250, select: false })
  password: string;

  @Column({ type: "enum", enum: ["M", "F", "O"], nullable: true, default: null })
  gender: "M" | "F" | "O" | null;

  @Column({ type: "datetime", nullable: true, default: null })
  birth_date: Date | null;

  @Column({ type: "varchar", length: 3, nullable: true, default: "CRC" })
  country_iso_code: string | null;

  @Column({ type: "varchar", length: 250, nullable: true })
  province: string | null;

  @Column({ type: "varchar", length: 250, nullable: true, default: null })
  address: string | null;

  @Column({ type: "varchar", length: 200, nullable: true, default: null })
  city_name: string | null;

  @Column({ type: "varchar", length: 50, nullable: true, default: null })
  postal_code: string | null;

  @Column({ type: "varchar", length: 100 })
  role_code: string;

  @Column({ type: "tinyint", default: 0 })
  is_deleted: boolean;

  @Column({ type: "tinyint", default: 0 })
  is_active_from_email: boolean;

  @Column({ type: "enum", enum: ["active", "pending", "suspended", "closed"], default: "pending" })
  account_status: "active" | "pending" | "suspended" | "closed";

  @Column({ type: "int", unsigned: true, default: 0 })
  fail_login_number: number;

  @Column({ type: "varchar", length: 400, nullable: true, default: null })
  forgot_password_token: string | null;

  @Column({ type: "varchar", length: 400, nullable: true, default: null })
  active_register_token: string | null;

  @Column({ type: "decimal", precision: 11, scale: 8, nullable: true, default: null })
  latitude: number | null;

  @Column({ type: "decimal", precision: 11, scale: 8, nullable: true, default: null })
  longitude: number | null;

  @ManyToOne(() => User, { nullable: true, lazy: true })
  @JoinColumn({ name: "finance_entity", referencedColumnName: "id" })
  finance_entity: User | null;

  @Column({ type: "varchar", length: 10, nullable: true, default: "es" })
  language: string | null;

  @Column({ type: "varchar", length: 500, nullable: true, default: null })
  profile_picture_url: string | null;

  @Column({ type: "datetime", nullable: true, default: null })
  last_login_at: Date | null;

  @Column({ type: "varchar", length: 45, nullable: true, default: null })
  login_ip_address: string | null;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at: Date;

  @Column({ type: "datetime", nullable: true, default: null })
  verified_at: Date | null;
}
