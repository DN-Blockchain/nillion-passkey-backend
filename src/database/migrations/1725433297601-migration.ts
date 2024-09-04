import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1725433297601 implements MigrationInterface {
    name = 'Migration1725433297601'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`passkeys\` (\`id\` int NOT NULL AUTO_INCREMENT, \`cred_id\` varchar(255) NOT NULL, \`cred_public_key\` blob NOT NULL, \`internal_user_id\` int NOT NULL, \`webauthn_user_id\` varchar(255) NOT NULL DEFAULT '', \`counter\` int NOT NULL, \`backup_eligible\` tinyint NOT NULL, \`backup_status\` tinyint NOT NULL, \`transports\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`current_token\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`passkeys\` ADD CONSTRAINT \`FK_805749ecf55a6f07ebc02414dc0\` FOREIGN KEY (\`internal_user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`passkeys\` DROP FOREIGN KEY \`FK_805749ecf55a6f07ebc02414dc0\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`passkeys\``);
    }

}
