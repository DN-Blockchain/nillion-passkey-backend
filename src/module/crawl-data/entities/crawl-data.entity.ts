import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'crawl_data' })
export class CrawlData {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'bigint' })
	member_id: number;

	@Column({ type: 'int' })
	type: number;

	@Column({ type: 'int' })
	status: number;

	@Column({ type: 'varchar' })
	phone_number: string;

	@CreateDateColumn({ type: 'timestamp' })
	created_at: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updated_at: Date;
}
