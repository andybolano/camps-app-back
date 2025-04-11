import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateMaxScoreType1744409548417 implements MigrationInterface {
  name = 'UpdateMaxScoreType1744409548417';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Primero convertimos los valores existentes a decimal
    await queryRunner.query(
      `ALTER TABLE "event" ALTER COLUMN "maxScore" TYPE decimal(10,2) USING "maxScore"::decimal(10,2)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertimos el cambio volviendo a float
    await queryRunner.query(
      `ALTER TABLE "event" ALTER COLUMN "maxScore" TYPE float USING "maxScore"::float`,
    );
  }
}
