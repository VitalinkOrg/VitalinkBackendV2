import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Appointment } from "./Appointment";
import { User } from "@TenshiJS/entity/User";
import { UnitDynamicCentral } from "@TenshiJS/entity/UnitDynamicCentral";

@Entity("appointment_flow_log")
export class AppointmentFlowLog {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @ManyToOne(() => Appointment)
  @JoinColumn({ name: "appointment_id", referencedColumnName: "id" })
  appointment: Appointment;

  @ManyToOne(() => UnitDynamicCentral)
  @JoinColumn({ name: "flow_event", referencedColumnName: "code" })
  flow_event: UnitDynamicCentral | null;

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
