import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1724922104903 implements MigrationInterface {
    name = 'migration1724922104903'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "passkeys" ("id" SERIAL NOT NULL, "cred_public_key" bytea NOT NULL, "user_id" bigint NOT NULL, "webauthn_user_id" character varying NOT NULL, "counter" integer NOT NULL, "backup_eligible" boolean NOT NULL, "backup_status" boolean NOT NULL, "transports" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_db928e6fd79e7098911268a74c3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "current_token" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "passkeys"`);
    }

}
