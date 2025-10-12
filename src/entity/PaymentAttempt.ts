import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from "typeorm";
import { User } from "@TenshiJS/entity/User";
import { Appointment } from "./Appointment";

export type PaymentAttemptStatus =
  | "created"
  | "pending"
  | "accepted"
  | "declined"
  | "error";

@Entity("payment_attempts")
@Unique("UQ_payment_attempts_reference", ["reference"])
@Index("IDX_payment_attempts_txid", ["transaction_id"])
export class PaymentAttempt {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  // Quién ejecuta la transacción
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;

  // Cita opcional asociada
  @ManyToOne(() => Appointment, { eager: true, nullable: true })
  @JoinColumn({ name: "appointment_id", referencedColumnName: "id" })
  appointment: Appointment | null;

  // Referencia propia por intento (REQ: req_reference_number)
  @Column({ type: "varchar", length: 64 })
  reference: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  amount: number | null;

  @Column({ type: "varchar", length: 3, default: "CRC" })
  currency: string;

  @Column({ type: "varchar", length: 10, default: "test" })
  environment: string; // test | prod

  @Column({ type: "varchar", length: 10, default: "redirect" })
  mode: "redirect" | "embedded";

  @Column({ type: "varchar", length: 16, default: "created" })
  status: PaymentAttemptStatus;

  // Resultado Cybersource
  @Column({ type: "varchar", length: 16, nullable: true })
  decision: string | null; // ACCEPT | REJECT | ERROR

  @Column({ type: "varchar", length: 10, nullable: true })
  reason_code: string | null;

  @Column({ type: "varchar", length: 64, nullable: true, unique: false })
  transaction_id: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  request_token: string | null;

  // Metadatos de tarjeta (no sensibles)
  @Column({ type: "varchar", length: 20, nullable: true })
  card_scheme: string | null; // Visa/Mastercard/Amex

  @Column({ type: "varchar", length: 5, nullable: true })
  card_type_code: string | null; // 001/002/003

  @Column({ type: "varchar", length: 4, nullable: true })
  card_last4: string | null;

  // 3DS / riesgo
  @Column({ type: "varchar", length: 64, nullable: true })
  device_fingerprint_id: string | null;

  @Column({ type: "varchar", length: 64, nullable: true })
  payer_auth_tx: string | null;

  @Column({ type: "varchar", length: 16, nullable: true })
  mdd5_channel: string | null; // WEB

  @Column({ type: "varchar", length: 128, nullable: true })
  mdd6_merchant_name: string | null;

  @Column({ type: "varchar", length: 45, nullable: true })
  customer_ip_address: string | null;

  // Auditoría / firma
  @Column({ type: "tinyint", width: 1, default: 0 })
  signed_ok_notify: boolean;

  @Column({ type: "tinyint", width: 1, default: 0 })
  signed_ok_receipt: boolean;

  @Column({ type: "json", nullable: true })
  raw_notify: any | null;

  @Column({ type: "json", nullable: true })
  raw_receipt: any | null;

  @Column({ type: "timestamp", nullable: true, default: null })
  webhook_received_at: Date | null;

  @Column({ type: "timestamp", nullable: true, default: null })
  receipt_received_at: Date | null;

  //********************************** */
  //            BASIC FIELDS
  //********************************** */
  @Column({ type: "tinyint", default: 0 })
  is_deleted: boolean;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
  created_date: Date | null;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_date: Date | null;
}
