
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { UnitDynamicCentral } from "@TenshiJS/entity/UnitDynamicCentral";
import { Review } from "./Review";

@Entity("reviews_detail")
export class ReviewDetail {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @ManyToOne(() => Review, { eager: true })
  @JoinColumn({ name: "review", referencedColumnName: "id" })
  review: Review;

  @Column({ type: "double", nullable: false, default: 0 })
  stars_point: number;

  @ManyToOne(() => UnitDynamicCentral)
  @JoinColumn({ name: "review_code", referencedColumnName: "code" })
  review_code: UnitDynamicCentral;

  @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
  created_date: Date | null;
}