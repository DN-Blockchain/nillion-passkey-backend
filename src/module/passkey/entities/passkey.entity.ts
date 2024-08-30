import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'passkeys' })
export class Passkey {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar' })
	cred_id: string;

	@Column({ type: 'bytea' })
	cred_public_key: Uint8Array;

	@Column({ type: 'bigint' })
	internal_user_id?: number;

	@Column({ type: 'varchar' })
	webauthn_user_id?: string;

	@Column({ type: 'int' })
	counter?: number;

	@Column({ type: 'boolean' })
	backup_eligible?: boolean;

	@Column({ type: 'boolean' })
	backup_status?: boolean;

	@Column({ type: 'varchar' })
	transports?: string;

	@CreateDateColumn({ type: 'timestamp' })
	created_at: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updated_at: Date;
}
