import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1724923766107 implements MigrationInterface {
    name = 'migration1724923766107'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "current_token" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "current_token" SET NOT NULL`);
    }

}
