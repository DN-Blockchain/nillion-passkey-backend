import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "crawl_project" })
export class CrawlProject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  type: number;

  @Column({ type: "varchar", nullable: true })
  url: string;

  @Column({ type: "bigint" })
  member_id: number;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}
