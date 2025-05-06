import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Appointment } from "./Appointment";
import { User } from "@TenshiJS/entity/User";

@Entity("appointment_flow_log")
export class AppointmentFlowLog {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @ManyToOne(() => Appointment)
  @JoinColumn({ name: "appointment_id", referencedColumnName: "id" })
  appointment: Appointment;

  // Texto clave o semántico del evento (ej: 'VALORATION_CONFIRMED', 'PROCEDURE_PAID')
  @Column({ name: "flow_event_code", type: "varchar", length: 100 })
  flow_event_code: string;

  // Descripción amigable para el historial
  @Column({ type: "text", nullable: true, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  description: string | null;

  // Usuario que ejecutó la acción (puede ser médico, paciente, admin, etc.)
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "performed_by_user", referencedColumnName: "id" })
  performed_by: User | null;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;
}
