import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveMaxScoreDefault1744409887561 implements MigrationInterface {
    name = 'RemoveMaxScoreDefault1744409887561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "maxScore" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "maxScore" SET DEFAULT '100'`);
    }

}
