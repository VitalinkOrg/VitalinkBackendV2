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

  @Column({ type: "varchar", length: 250 })
  name: string;

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

  @Column({ type: "decimal", precision: 11, scale: 8, nullable: true, default: null })
  latitude: number | null;

  @Column({ type: "decimal", precision: 11, scale: 8, nullable: true, default: null })
  longitude: number | null;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "user", referencedColumnName: "id" })
  legal_representative: User | null;

  @Column({ type: "tinyint", default: 0 })
  is_deleted: boolean;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
  created_date: Date | null;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_date: Date | null;
}
