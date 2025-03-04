
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { UnitDynamicCentral } from "@TenshiJS/entity/UnitDynamicCentral";
import { Review } from "./Review";

@Entity("reviews_detail")
export class ReviewDetail {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @ManyToOne(() => Review, { eager: true })
  @JoinColumn({ name: "review_id", referencedColumnName: "id" })
  review: Review;

  @Column({ type: "int" })
  stars_point: number;

  @ManyToOne(() => UnitDynamicCentral)
  @JoinColumn({ name: "udc_code", referencedColumnName: "code" })
  udc_code: UnitDynamicCentral;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
  created_date: Date | null;
}