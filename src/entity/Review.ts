import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Supplier } from "../../tenshi/entity/Supplier";
import { User } from "@TenshiJS/entity/User";
import { Package } from "./Package";
import { Appointment } from "./Appointment";


@Entity("reviews")
export class Review {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "customer", referencedColumnName: "id" })
  customer: User;

  @ManyToOne(() => Appointment)
  @JoinColumn({ name: "appointment", referencedColumnName: "id" })
  appointment: Appointment;

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