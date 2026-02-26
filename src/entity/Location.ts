import { Supplier } from "@TenshiJS/entity/Supplier";
import { User } from "@TenshiJS/entity/User";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

/**
 * The Place table stores information about physical locations, including 
 * country, province, city, address, postal code, and geographic coordinates 
 * (latitude and longitude). It also references a legal representative role (`user`) 
 */

@Entity("locations")
export class Location {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "varchar", length: 250, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  name: string;

  @Column({ type: "varchar", length: 3, nullable: true, default: "CRC" })
  country_iso_code: string | null;

  @Column({ type: "varchar", length: 250, nullable: true, default: null, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  province: string | null;

  @Column({ type: "varchar", length: 250, nullable: true, default: null, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  address: string | null;

  @Column({ type: "varchar", length: 200, nullable: true, default: null, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  city_name: string | null;

  @Column({ type: "varchar", length: 50, nullable: true, default: null, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  postal_code: string | null;

  @Column({ type: "decimal", precision: 11, scale: 8, nullable: true, default: null })
  latitude: number | null;

  @Column({ type: "decimal", precision: 11, scale: 8, nullable: true, default: null })
  longitude: number | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: "legal_representative", referencedColumnName: "id" })
  legal_representative: User | null;

  @Column({ type: "tinyint", default: 0 })
  is_deleted: boolean;

  @Column({ type: "int", unsigned: true, nullable: true, default: null })
  supplier_id?: number | null;

  @ManyToOne(() => Supplier, { nullable: true })
  @JoinColumn({ name: "supplier_id", referencedColumnName: "id" })
  supplier?: Supplier | null;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
  created_date: Date | null;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_date: Date | null;
}
