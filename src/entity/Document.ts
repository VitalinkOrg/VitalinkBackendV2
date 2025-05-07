// src/entity/Document.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("documents")
export class Document {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  //the title or the document, this cannot will be change
  @Column({ type: "varchar", length: 350, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  title: string;

  //the code is the title but in upper case
  @Column({ type: "varchar", length: 500, unique: true, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  code: string;

  //this is the file name upload to aws or to server
  @Column({ type: "varchar", length: 500, unique: true, charset: "utf8mb4", collation: "utf8mb4_unicode_ci"  })
  file_name: string;

  @Column({ type: "varchar", length: 10, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  extension: string;

  @Column({ type: "enum", 
            enum: ["PROFILE_PICTURE", "GENERAL_GALLERY", 
                    "PERSONAL_DOCUMENT", "PRIVATE_CONTRACT", 
                    "MEDICAL_PROCEDURE_ATTACHMENT", "OTHER", "PROFORMA_INVOICE"], 
            default: "GENERAL_GALLERY" })
  action_type: string; 

  @Column({ type: "enum", enum: ["DOC", "IMG", "OTHER"], default: "IMG" })
  type: "DOC" | "IMG" | "OTHER";

  @Column({ type: "varchar", length: 400, nullable: true, default: null, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  description: string | null;

  @Column({ type: "varchar", length: 500, nullable: true, default: null, charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  url: string | null;

  @Column({ type: "int", unsigned: true })
  id_for_table: number;

  @Column({ type: "varchar", length: 100, default: "GENERAL", charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  table: string;

  @Column({ type: "tinyint", default: 0 })
  is_deleted: boolean;

  @Column({ type: "tinyint", default: 0 })
  is_public: boolean;

  @Column({ type: "varchar", length: 500, nullable: true, default: null  })
  user_id: string | null;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created_date: Date;
}
