import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDirectorAndPastorToClub1712880000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "club"
      ADD COLUMN "directorCount" integer NOT NULL DEFAULT 0,
      ADD COLUMN "pastorCount" integer NOT NULL DEFAULT 0
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "club"
      DROP COLUMN "directorCount",
      DROP COLUMN "pastorCount"
    `);
  }
}
