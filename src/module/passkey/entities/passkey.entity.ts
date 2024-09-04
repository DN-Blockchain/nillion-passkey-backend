import { User } from 'src/module/user/entities/user.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'passkeys' })
export class Passkey {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar' })
	cred_id: string;

	@Column({ type: 'blob' })
	cred_public_key: Uint8Array;

	@Column({ type: 'bigint' })
	internal_user_id?: number;

	@Column({ type: 'varchar', default: '' })
	webauthn_user_id?: string;

	@Column({ type: 'int' })
	counter?: number;

	@Column({ type: 'boolean' })
	backup_eligible?: boolean;

	@Column({ type: 'boolean' })
	backup_status?: boolean;

	@Column({ type: 'varchar' })
	transports?: string;

	@CreateDateColumn({ type: 'datetime' })
	created_at: Date;

	@UpdateDateColumn({ type: 'datetime' })
	updated_at: Date;

	@ManyToOne(() => User, (user) => user.passkeys)
	@JoinColumn({ name: 'user_id' })
	user?: User;
}
