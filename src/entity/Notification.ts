// src/entity/Notification.ts
import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "varchar", length: 60, unique: true })
  code: string;

  @Column({ type: "varchar", length: 30,  nullable: true, default: "GENERAL", charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  type: string;

  @Column({ type: "varchar", length: 100, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  subject: string;

  @Column({ type: "varchar", length: 250, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  message: string;

  @Column({ type: "tinyint", default: 0 })
  required_send_email: boolean;

  @Column({ type: "tinyint", default: 1 })
  is_delete_after_read: boolean;

  @Column({ type: "varchar", length: 400, nullable: true, default: null, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  action_url: string | null;

  @Column({ type: "varchar", length: 10, nullable: true, default: "es" })
  language: string | null;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created_date: Date;

}
