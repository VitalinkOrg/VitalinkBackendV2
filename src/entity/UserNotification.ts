// src/entity/UserNotification.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Notification } from "./Notification";
import { User } from "@TenshiJS/entity/User";

@Entity("user_notifications")
export class UserNotification {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "varchar", length: 500, nullable: true, default: null, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  body_action: string;

  @Column({ type: "tinyint", default: 0 })
  is_read: boolean;

  @Column({ type: "tinyint", default: 0 })
  is_deleted: boolean;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created_date: Date;

  @ManyToOne(() => Notification, notification => notification.id)
  @JoinColumn({ name: "notification", referencedColumnName: "code" })
  notification: Notification;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: "user_send", referencedColumnName: "id" })
  user_send: User | null;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: "user_receive", referencedColumnName: "id" })
  user_receive: User;
}
