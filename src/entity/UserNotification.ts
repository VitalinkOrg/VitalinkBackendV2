// src/entity/UserNotification.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Notification } from "./Notification";

@Entity("user_notifications")
export class UserNotification {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "int", unsigned: true, nullable: true })
  id_user_send: number | null;

  @Column({ type: "int", unsigned: true })
  id_user_receive: number;

  @Column({ type: "varchar", length: 60 })
  notification_code: string;

  @Column({ type: "varchar", length: 500, nullable: true, default: null })
  body_action: string;

  @Column({ type: "tinyint", default: 0 })
  is_read: boolean;

  @Column({ type: "tinyint", default: 0 })
  is_deleted: boolean;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created_date: Date;

  @Column({ type: "varchar", length: 200, nullable: true, default: null })
  app_guid: string | null;

  @ManyToOne(() => Notification, notification => notification.id)
  @JoinColumn({ name: "notification_code", referencedColumnName: "code" })
  notification: Notification;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: "id_user_send", referencedColumnName: "id" })
  userSend: User;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: "id_user_receive", referencedColumnName: "id" })
  userReceive: User;
}
