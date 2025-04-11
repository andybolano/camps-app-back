import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMaxScoreToEvent1712880000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "event"
      ADD COLUMN "maxScore" float NOT NULL DEFAULT 100
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "event"
      DROP COLUMN "maxScore"
    `);
  }
}
