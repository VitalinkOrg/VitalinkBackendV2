import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Supplier } from "./Supplier";
import { User } from "@TenshiJS/entity/User";
import { Package } from "./Package";
import { Appointment } from "./Appointment";


@Entity("reviews")
export class Review {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @ManyToOne(() => Supplier, { eager: true })
  @JoinColumn({ name: "supplier", referencedColumnName: "id" })
  supplier: Supplier;

  @ManyToOne(() => Package, { eager: true })
  @JoinColumn({ name: "package", referencedColumnName: "id" })
  package: Package;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "customer", referencedColumnName: "id" })
  customer: User;

  @ManyToOne(() => Appointment, { eager: true })
  @JoinColumn({ name: "appointment", referencedColumnName: "id" })
  appointment: Appointment | null;

  @Column({ type: "text", nullable: true })
  comment: string | null;

  @Column({ type: "boolean", default: false })
  is_annonymous: boolean;

  @Column({ type: "text", nullable: true, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  supplier_reply: string | null;

  @Column({ type: "tinyint", default: 0 })
  is_deleted: boolean;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
  created_date: Date | null;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_date: Date | null;
}